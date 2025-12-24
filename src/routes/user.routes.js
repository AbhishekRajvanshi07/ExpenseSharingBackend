const express = require('express');
const router = express.Router();

const { createUser, getAllUsers } = require('../controllers/user.controller');

router.post('/', createUser);     // Create user
router.get('/', getAllUsers);     // Get all users

module.exports = router;
