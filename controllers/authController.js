const nodemailer = require("nodemailer");
const User = require("../models/SignupModel"); // Import the User model, make sure the path is correct
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const SECRET = 'qwertyuioplkjhgfdszcvbnm,'; // Secret key for JWT
const CONFIG = require('../config/config'); // Import your configuration

// Function for handling the login request
exports.login = async (req, res) => {
  const { email, password } = req.body; // Extract 'email' and 'password' properties from the request body

  try {
    const user = await User.findOne({ email }); // Find a user by their email

    if (!user) {
      return res.status(401).json({ message: "EITHER EMAIL NOR PASSWORD IS INVALID" });
    }

    if (user.accountLocked) {
      const now = new Date();
      if (user.lockUntil > now) {
        const remainingTime = Math.ceil((user.lockUntil - now) / 1000); // Convert to seconds
        console.log(`Try again after ${remainingTime} seconds.`);
        return res.status(401).json({ message: ` Try again after ${remainingTime} seconds.` });
      } else {
        // Reset failed login attempts and unlock the account
        user.failedLoginAttempts = 0;
        user.accountLocked = false;
        await user.save();
      }
    }

    // Compare the provided password with the stored hashed password using bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Reset failed login attempts on successful login
      user.failedLoginAttempts = 0;
      await user.save();

      // Create a JWT token for authentication
      const tokenPayload = {
        userId: user.id,
        username: user.username, // Assuming you have an 'username' field in your User model
      };

      const token = jwt.sign({ userId: user.id }, CONFIG.jwtSecret, {
        expiresIn: CONFIG.jwtExpiration,
      });

      console.log(token);

      // Extend responseData with additional user details for the response
      const responseData = {
        token,
        username: user.username, // Send the user's username in the response
        username1: user.username1,
        email: user.email,
        dob: user.dob, // Assuming 'dob' is a field in your User model
        gender: user.gender, // Assuming 'gender' is a field in your User model
        fullname: user.fullname, // Assuming 'fullname' is a field in your User model
        createdby: user.createdby, // Assuming 'createdby' is a field in your User model
      };

      res.json(responseData);
    } else {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 3) {
        user.accountLocked = true;
        user.lockUntil = new Date(Date.now() + 10 * 1000); // Lock for 10 seconds
      }
      await user.save();

      res.status(401).json({ message: "EITHER EMAIL NOR PASSWORD IS INVALID" });
    }
  } catch (error) {
    console.error("ERROR OCCURED DURING LOGIN", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function for handling the "Forgot Password" request
exports.forgotPassword = async (req, res) => {
  const { email } = req.body; // Extract the 'email' property from the request body

  try {
    const user = await User.findOne({ email }); // Find a user by their email

    if (!user) {
      return res.status(400).json({ message: "THE EMAIL IS NOT FOUND" });
    }

    // Generate a unique reset token for the user using JWT, which expires in 1 hour
    const resetToken = jwt.sign({ userId: user._id }, SECRET, { expiresIn: '1h' });

    const resetLink = `http://localhost:3000/RESETPASSWORD/${resetToken}`; // Create a reset link

    // Create a transporter for sending emails using nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
         user: "sricharlie31@gmail.com", // Update with your email
         pass: "mugzdssffegicaqp", // Update with your email password
      },
    });
    
    const mailOptions = {
      from: "sricharlie31@gmail.com", // Update with your email
      to: email,
      subject: "Password Reset",
      html: `Select <a href="${resetLink}">here</a> to reset your password.`,
    };

    await transporter.sendMail(mailOptions); // Send the reset email
    console.log("NEW PASSWORD UPDATED");
    res.json({ message: "NEW PASSWORD UPDATED" });
  } catch (error) {
    console.error("ERROR OCCURED WHILE SENDING MAIL", error);
    res.status(500).json({ message: "FAILED WHILE RESET MAIL IS SENT " });
  }
};

// Function for handling the "Reset Password" request
exports.resetPassword = async (req, res) => {
  const { token } = req.params; // Extract the 'token' parameter from the request
  const { password } = req.body; // Extract the 'password' property from the request body

  try {
    // Verify the reset token without querying the database using JWT
    const decodedToken = jwt.verify(token, SECRET);

    const user = await User.findById(decodedToken.userId); // Find the user by ID from the token

    if (!user) {
      return res.status(400).json({ message: "UNKNOWN USER" });
    }

    // Hash the new password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

    user.password = hashedPassword; // Update the user's password with the new hashed password
    await user.save(); // Save the updated user

    res.status(200).json({ message: "PASSWORD UPDATED SUCCESSFULLY" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "AN ERROR OCCURED" });
  }
};

