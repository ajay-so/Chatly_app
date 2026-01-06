const User = require("../models/User.js");
const Message = require("../models/Message.js");
const {getReceiverSocketIds} = require("../utils/socket.js");
const {io} = require("../utils/socket.js");
const cloudinary = require('../utils/cloudinary.js');

const getALLContacts = async (req, res) => {
    try {
        const loggedUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedUserId } }).select('-password');
        res.status(200).json({ message: "Contacts fetched successfully", data: filteredUsers });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

const getMessagesByUserId = async (req, res) => {
    try {
        const senderId = req.user._id.toString();
        const { id: receiverId } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json({
            message: "Messages fetched successfully",
            data: messages
        });
    } catch (error) {
        console.log("error in getMessagesByUserId:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

const sendMessage = async (req, res) => {
    try {
        const senderId = req.user._id.toString();
        const { id: receiverId } = req.params;
        const { text, image } = req.body;

        // 1️⃣ Validation
        if (!text && !image) {
            return res.status(400).json({ message: "Text or image is required" });
        }

        if (senderId === receiverId) {
            return res.status(400).json({ message: "You cannot message yourself" });
        }

        const receiverExists = await User.findById(receiverId);
        if (!receiverExists) {
            return res.status(404).json({ message: "Receiver not found" });
        }

        // 2️⃣ Upload image to Cloudinary (if exists)
        let imageUrl = null;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image, {
                folder: "chat_app_messages",
                resource_type: "image",
            });
            imageUrl = uploadResponse.secure_url;
        }

        // 3️⃣ Save message to DB
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        // 4️⃣ Emit to all receiver sockets
        const receiverSocketIds = getReceiverSocketIds(receiverId);
        receiverSocketIds.forEach(socketId => {
            io.to(socketId).emit("newMessage", newMessage);
        });

        // 5️⃣ Emit to all sender sockets (sync all tabs)
        const senderSocketIds = getReceiverSocketIds(senderId);
        senderSocketIds.forEach(socketId => {
            io.to(socketId).emit("newMessage", newMessage);
        });

        // 6️⃣ Response
        res.status(201).json(newMessage);

    } catch (error) {
        console.error("sendMessage error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};


const getAllChatPartners = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        //find all the messages where the user is either sender or receiver
        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId },
                { receiverId: loggedInUserId }
            ]
        });

        const chatPartnerIds = [
            ...new Set(messages.map(msg => (
                msg.senderId.toString() === loggedInUserId.toString() ? msg.receiverId.toString() : msg.senderId.toString()
            )))
        ];

        const chatPartners = await User.find({ _id: { $in: chatPartnerIds } }).select('-password');

        res.status(200).json({ message: "Chat partners fetched successfully", data: chatPartners });
    } catch (error) {
        console.log("error in getAllChatPartners:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

module.exports = {
    getALLContacts,
    getMessagesByUserId,
    sendMessage,
    getAllChatPartners
}