const User = require('../models/SignupModel'); // Import the User model, make sure the path is correct
const bcrypt = require('bcryptjs'); // Import bcryptjs for password hashing
const CONFIG = require('../config/config'); // Import your configuration
const jwt = require('jsonwebtoken'); // Import jwt library for token generation and validation

// Function for registering an admin user
exports.AdminSignup = async (req, res) => {
  const { username, username1, email, password, createdby } = req.body; // Extract admin user data from the request body

  try {
    // Check if an existing user with the same email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'THIS EMAIL ALREADY EXISTS' });//user not allowed to signup with same email id  twice
    }
// Hash the admin user's password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
// Create a new admin user with hashed password and additional details
    const newUser = new User({
      username1,
      email,
      password: hashedPassword, 
      createdby: username + " admin", // Adding the username of the admin who created this user
    });
// Save the new admin user to the database
    await newUser.save();

    res.status(201).json({ message: 'REGISTERED BY ADMIN SUCCESSFULLY' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
  }
};
// Function for retrieving a list of admin users
module.exports.getadminUserList = async (req, res) => {
  try {
    // Retrieve all admin users from the database
    const users = await User.find();

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'SORRY , NO USERS FOUND' });
    }

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'AN ERROR OCCURED' });
  }
};
