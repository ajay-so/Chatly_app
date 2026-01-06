const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const { ENV } = require("../utils/env.js");

const socketAuthMiddleware = async (socket, next) => {
    try {
        const cookieHeader = socket.handshake.headers.cookie;
        if (!cookieHeader) {
            return next(new Error("Unauthorized - No Cookies"));
        }

        const token = cookieHeader
            .split(";")
            .map(c => c.trim())
            .find(row => row.startsWith("jwt="))
            ?.split("=")[1];

        if (!token) {
            return next(new Error("Unauthorized - No Token"));
        }

        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return next(new Error("User not found"));
        }

        socket.user = user;
        socket.userId = user._id.toString();

        next();
    } catch (err) {
        next(new Error("Unauthorized"));
    }
};

module.exports = { socketAuthMiddleware };
