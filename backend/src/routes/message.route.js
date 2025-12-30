const express = require('express');
const router = express.Router();
const { tokenVerify } = require('../middlewares/auth.middleware.js');
const { getALLContacts, getMessagesByUserId, sendMessage } = require('../controllers/message.controller.js');

router.get("/contacts", tokenVerify, getALLContacts);
// router.get("/chats", tokenVerify, getAllChatPartners);
router.get("/:id", tokenVerify, getMessagesByUserId);
router.post("/send/:id", tokenVerify, sendMessage);

module.exports = router;