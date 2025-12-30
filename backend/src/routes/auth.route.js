const express = require('express');
const router = express.Router();
const { tokenVerify } = require('../middlewares/auth.middleware.js');
const { signUpUser, loginUser, logoutUser, uploadProfilePic } = require('../controllers/auth.controller.js');

router.post('/signup', signUpUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

router.put("/uploadPic", tokenVerify, uploadProfilePic);

router.get("/check", tokenVerify, (req, res) => res.json({ message: "Auth route is working", user: req.user }));

module.exports = router;