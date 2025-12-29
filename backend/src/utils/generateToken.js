const jwt = require('jsonwebtoken');
const { ENV } = require('./env.js');

const createToken = (userId, res) => {
    if(!ENV.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign({ id: userId }, ENV.JWT_SECRET, { expiresIn: '7d' });
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: ENV.NODE_ENV === 'production' ? true : false
    });

    return token;
}

module.exports = { createToken };