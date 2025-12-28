const bcrypt = require('bcryptjs');
const User = require('../models/User.js');

const signUpUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields must be required" });
        }

        // Password validation
        if (password.length > 6) {
            return res.status(400).json({ message: "password must be atleast 6 character" });
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
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully", user: newUser });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const loginUser = (req, res) => {
    res.send('login');
}

const logoutUser = (req, res) => {
    res.send('logout');
}

module.exports = { signUpUser, loginUser, logoutUser };