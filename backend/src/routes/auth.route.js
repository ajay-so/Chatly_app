const express = require('express');
const router = express.Router();

const { signUpUser, loginUser, logoutUser } = require('../controllers/auth.controller.js');

router.get('/register', signUpUser);
router.get('/login', loginUser);
router.get('/logout', logoutUser);

module.exports = router;