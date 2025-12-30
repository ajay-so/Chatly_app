const bcrypt = require('bcryptjs');
const User = require('../models/User.js');
const { createToken } = require('../utils/generateToken.js');
const { sendWelcomeEmail } = require('../emails/emailHandler.js');
const ENV = require("../utils/env.js")

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
        try {
            await sendWelcomeEmail(newUser.fullname, newUser.email, ENV.FRONTEND_URL);
        } catch (error) {
            console.log("Error sending welcome email:", error);
        }

    } catch (error) {
        console.log("Error is in signUpUser:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        createToken(user._id, res);

        res.status(200).json({ message: "User logged in successfully", user });

    } catch (error) {
        console.log("Error is in loginUser:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const logoutUser = (req, res) => {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "User logged out successfully" });
}

module.exports = { signUpUser, loginUser, logoutUser };