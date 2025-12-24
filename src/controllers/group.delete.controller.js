const Group = require('../models/Group');
const Expense = require('../models/Expense');
const Settlement = require('../models/Settlement');
const mongoose = require('mongoose');
const { calculateBalances } = require('../services/balance.service');

exports.deleteGroupIfSettled = async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: 'Invalid group id' });
    }

    const group = await Group.findById(groupId);
    if (!group || group.isDeleted) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // fetch financial records
    const expenses = await Expense.find({ group: groupId });
    const settlements = await Settlement.find({ group: groupId });

    // calculate balances
    const balances = calculateBalances(expenses, settlements);

    if (Object.keys(balances).length !== 0) {
      return res.status(400).json({
        message: 'Group cannot be deleted. Pending balances exist.',
        balances
      });
    }

    // soft delete group
    group.isDeleted = true;
    group.deletedAt = new Date();
    await group.save();

    return res.json({
      message: 'Group deleted successfully. Financial history preserved.'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
