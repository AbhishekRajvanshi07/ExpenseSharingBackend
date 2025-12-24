// src/controllers/group.controller.js
const Group = require("../models/Group");
const User = require("../models/User");
const mongoose = require("mongoose");

exports.createGroup = async (req, res, next) => {
  try {
    const { name, memberIds = [] } = req.body;
    if (!name) return res.status(400).json({ error: "name is required" });

    // Validate that all provided memberIds exist (if any)
    if (!Array.isArray(memberIds))
      return res.status(400).json({ error: "memberIds must be an array" });

    const uniqueIds = [...new Set(memberIds)];

    // Ensure each id is valid ObjectId
    for (const id of uniqueIds) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: `invalid user id: ${id}` });
      }
    }

    const users = await User.find({ _id: { $in: uniqueIds } }).select("_id");
    if (users.length !== uniqueIds.length) {
      return res.status(400).json({ error: "one or more user ids not found" });
    }

    const group = new Group({ name, members: uniqueIds });
    await group.save();

    // populate members for response
    await group.populate("members", "name email");

    res.status(201).json(group);
  } catch (err) {
    next(err);
  }
};

exports.addMember = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(groupId))
      return res.status(400).json({ error: "invalid group id" });
    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ error: "invalid user id" });

    const [group, user] = await Promise.all([
      Group.findById(groupId),
      User.findById(userId),
    ]);

    if (!group) return res.status(404).json({ error: "group not found" });
    if (!user) return res.status(404).json({ error: "user not found" });

    // Prevent duplicate membership
    if (group.members.some((m) => m.equals(userId))) {
      return res.status(409).json({ error: "user already a member" });
    }

    group.members.push(userId);
    await group.save();
    await group.populate("members", "name email");
    res.json(group);
  } catch (err) {
    next(err);
  }
};

exports.getGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "invalid id" });

    const group = await Group.findById(id)
      .populate("members", "name email")
      .lean();
    if (!group) return res.status(404).json({ error: "group not found" });

    res.json(group);
  } catch (err) {
    next(err);
  }
};

exports.listGroups = async (req, res, next) => {
  try {
    const groups = await Group.find().populate("members", "name email").lean();
    res.json(groups);
  } catch (err) {
    next(err);
  }
};
