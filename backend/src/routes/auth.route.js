const express = require('express');
const router = express.Router();

const { signUpUser, loginUser, logoutUser } = require('../controllers/auth.controller.js');

router.post('/signup', signUpUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

module.exports = router;