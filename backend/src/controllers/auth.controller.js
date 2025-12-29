const bcrypt = require('bcryptjs');
const User = require('../models/User.js');
const { createToken } = require('../utils/generateToken.js');
const { sendWelcomeEmail } = require('../emails/emailHandler.js');
require('dotenv').config();

const signUpUser = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "All fields must be required" });
        }

        // Password validation
        if (password.length < 6) {
            return res.status(400).json({ message: "password must be at least 6 characters" });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullname,
            email,
            password: hashedPassword
        });

        if (newUser) {
            const savedUser = await newUser.save();
            createToken(savedUser._id, res);
            res.status(201).json({ message: "User registered successfully", user: savedUser });
        }

        // Send welcome email
        try{
            await sendWelcomeEmail(newUser.fullname, newUser.email, process.env.FRONTEND_URL);
        } catch (error) {
            console.log("Error sending welcome email:", error);
        }

    } catch (error) {
        console.log("Error is in signUpUser:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const loginUser = (req, res) => {

}

const logoutUser = (req, res) => {
    res.send('logout');
}

module.exports = { signUpUser, loginUser, logoutUser };