import express from 'express';

const router = express.Router();

import { registerUser, loginUser, logoutUser } from '../controllers/auth.controller.js';

router.get('/register', registerUser);
router.get('/login', loginUser);
router.get('/logout', logoutUser);

export default router;