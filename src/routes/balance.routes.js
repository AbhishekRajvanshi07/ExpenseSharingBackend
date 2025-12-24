const express = require('express');
const router = express.Router();

const { getGroupBalances } = require('../controllers/balance.controller');

router.get('/:groupId', getGroupBalances);

module.exports = router;
