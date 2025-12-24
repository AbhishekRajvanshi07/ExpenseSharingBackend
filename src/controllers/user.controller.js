const User = require('../models/User');

// CREATE USER
exports.createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    // basic validation
    if (!name || !email) {
      return res.status(400).json({
        message: 'Name and email are required'
      });
    }

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: 'User already exists with this email'
      });
    }

    const user = new User({ name, email });
    await user.save();

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

// GET ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

