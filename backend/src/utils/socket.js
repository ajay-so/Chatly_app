const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { socketAuthMiddleware } = require("../middlewares/socket.auth.middleware.js");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    },
    transports: ["websocket", "polling"],
});

// socket auth
io.use(socketAuthMiddleware);

// userId => Set of socketIds
const userSocketMap = {}; // { userId: Set(socketId) }

// helper
function getReceiverSocketIds(userId) {
    return userSocketMap[userId] || new Set();
}

io.on("connection", (socket) => {
    const userId = socket.userId;
    const fullName = socket.user?.fullName || "Unknown";

    if (!userId) {
        return socket.disconnect();
    }

    // console.log("User connected:", fullName, socket.id);

    // multiple sockets support
    if (!userSocketMap[userId]) {
        userSocketMap[userId] = new Set();
    }
    userSocketMap[userId].add(socket.id);

    // online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {

        if (userSocketMap[userId]) {
            userSocketMap[userId].delete(socket.id);

            if (userSocketMap[userId].size === 0) {
                delete userSocketMap[userId];
            }
        }

        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

module.exports = {
    app,
    server,
    io,
    getReceiverSocketIds,
};
