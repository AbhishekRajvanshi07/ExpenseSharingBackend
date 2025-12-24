const express = require('express');
const router = express.Router();
const { settleDue } = require('../controllers/settlement.controller');

// POST /api/settlements
router.post('/', settleDue);

module.exports = router;
