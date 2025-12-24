const Expense = require('../models/Expense');
const Group = require('../models/Group');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.createExpense = async (req, res) => {
  try {
    const {
      groupId,
      description,
      amount,
      paidBy,
      splitType,
      splits
    } = req.body;

    // basic validation
    if (!groupId || !amount || !paidBy || !splitType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!mongoose.Types.ObjectId.isValid(groupId) ||
        !mongoose.Types.ObjectId.isValid(paidBy)) {
      return res.status(400).json({ message: 'Invalid IDs' });
    }

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (!group.members.some(m => m.equals(paidBy))) {
      return res.status(400).json({ message: 'Payer must be a group member' });
    }

    const memberSet = new Set(group.members.map(id => id.toString()));

    let finalSplits = [];

    // ---- SPLIT LOGIC ----
    if (splitType === 'EQUAL') {
      const share = +(amount / group.members.length).toFixed(2);

      finalSplits = group.members.map(userId => ({
        user: userId,
        amount: share
      }));

    } else if (splitType === 'EXACT') {
      if (!Array.isArray(splits)) {
        return res.status(400).json({ message: 'Splits required for EXACT' });
      }

      let total = 0;
      for (const s of splits) {
        if (!memberSet.has(s.user)) {
          return res.status(400).json({ message: 'Split user not in group' });
        }
        total += s.amount;
      }

      if (total !== amount) {
        return res.status(400).json({ message: 'Split amounts do not sum to total' });
      }

      finalSplits = splits.map(s => ({
        user: s.user,
        amount: s.amount
      }));

    } else if (splitType === 'PERCENT') {
      if (!Array.isArray(splits)) {
        return res.status(400).json({ message: 'Splits required for PERCENT' });
      }

      let percentTotal = 0;
      finalSplits = splits.map(s => {
        percentTotal += s.percent;
        return {
          user: s.user,
          amount: +(amount * s.percent / 100).toFixed(2)
        };
      });

      if (percentTotal !== 100) {
        return res.status(400).json({ message: 'Percent total must be 100' });
      }

    } else {
      return res.status(400).json({ message: 'Invalid split type' });
    }

    const expense = new Expense({
      group: groupId,
      description,
      amount,
      paidBy,
      splitType,
      splits: finalSplits
    });

    await expense.save();

    return res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
