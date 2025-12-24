const express = require('express');
const router = express.Router();

const { createExpense } = require('../controllers/expense.controller');

// create expense
router.post('/', createExpense);

module.exports = router;
