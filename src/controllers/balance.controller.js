const Expense = require('../models/Expense');
const Group = require('../models/Group');
const Settlement = require('../models/Settlement');
const mongoose = require('mongoose');
const { calculateBalances } = require('../services/balance.service');

exports.getGroupBalances = async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: 'Invalid group id' });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Fetch expenses
    const expenses = await Expense.find({ group: groupId });

    // Fetch settlements (NEW)
    const settlements = await Settlement.find({ group: groupId });

    // Calculate balances using both
    const balances = calculateBalances(expenses, settlements);

    return res.json({
      groupId,
      balances
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
