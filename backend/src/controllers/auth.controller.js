const bcrypt = require('bcrypt');
const User = require('../models/User.js');

const signUpUser = async (req, res) => {
    res.send('register');
};

const loginUser = (req, res) => {
    res.send('login');
}

const logoutUser = (req, res) => {
    res.send('logout');
}

module.exports = { signUpUser, loginUser, logoutUser };