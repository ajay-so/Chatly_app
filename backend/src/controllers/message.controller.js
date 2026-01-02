const User = require("../models/User.js");
const Message = require("../models/Message.js");

const getALLContacts = async (req, res) => {
    try {
        const loggedUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedUserId } }).select('-password');
        res.status(200).json(filteredUsers);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

const getMessagesByUserId = async (req, res) => {
    try {
        const senderId = req.user._id;
        const { id: receiverId } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId, receiverId },
                { receiverId, senderId }
            ]
        });

        res.status(200).json({ message: "Messages fetched successfully", data: messages });
    } catch (error) {
        console.log("error in getMessageByUserId:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

const sendMessage = async (req, res) => {
    try {
        const senderId = req.user._id;
        const { id: receiverId } = req.params;
        const { text, image } = req.body;

        if (!text && !image) {
            return res.status(400).json({ message: "Text or image is required" });
        }

        if(receiverId.toString() === senderId.toString()) {
            return  res.status(400).json({ message: "You cannot send message to yourself" });
        }

        const receiverExists = await User.findById(receiverId);
        if (!receiverExists) {
            return res.status(404).json({ message: "Receiver not found" });
        }

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        // todo : send the message in real-time using socket.io

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

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