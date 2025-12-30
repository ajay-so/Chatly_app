const jwt = require('jsonwebtoken');
const { ENV } = require('../utils/env.js');
const User  = require('../models/User.js');

const tokenVerify = async (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ message: "No token provided, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        if(!decoded) {
            return res.status(401).json({ message: "Token is invalid, authorization denied" });
        }

        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: "User not found, authorization denied" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in tokenVerify:", error);
        return res.status(401).json({ message: "Token is invalid, authorization denied" }); 
    }
};

module.exports = { tokenVerify };