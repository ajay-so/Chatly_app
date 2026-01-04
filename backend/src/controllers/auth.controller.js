const bcrypt = require('bcryptjs');
const User = require('../models/User.js');
const { createToken } = require('../utils/generateToken.js');
const { sendWelcomeEmail } = require('../emails/emailHandler.js');
const ENV = require("../utils/env.js")
const cloudinary = require('../utils/cloudinary.js');


const signUpUser = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
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
            fullName,
            email,
            password: hashedPassword
        });

        // if (newUser) {
        //     const savedUser = await newUser.save();
        //     createToken(savedUser._id, res);
        //     res.status(201).json({ message: "User registered successfully", user: savedUser });
        // }

        // Send welcome email
        try {
            await sendWelcomeEmail(newUser.fullName, newUser.email, ENV.FRONTEND_URL);
            if (newUser) {
                const savedUser = await newUser.save();
                createToken(savedUser._id, res);
                res.status(201).json({ message: "User registered successfully", user: savedUser });
            }

        } catch (error) {
            res.status(500).json({ message: "Enter a valid email And Active email", error: error.message });
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

const uploadProfilePic = async (req, res) => {
    try {
        const { profilePic } = req.body;
        if (!profilePic) {
            return res.status(400).json({ message: "Profile picture URL is required" });
        }

        const userId = req.user._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID not found" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic, {
            folder: 'profile_pics',
            width: 150,
            height: 150,
            crop: 'fill'
        });

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        ).select('-password');

        res.status(200).json({ message: "Profile picture updated successfully", user: updatedUser });

    } catch (error) {
        console.log("Error is in uploadPic:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = { signUpUser, loginUser, logoutUser, uploadProfilePic };