const express = require('express');
const AuthRoutes = require('./routes/auth.route.js');
const connectDB = require('./utils/db.js');
const cookieParser = require('cookie-parser');
const rateLimit = require('./middlewares/rateLimit.middleware.js');
const MessageRoutes = require('./routes/message.route.js');
const { app, server } = require('./utils/socket.js');
const cors = require('cors');
const { ENV } = require('../src/utils/env.js');
const axios = require("axios");

const PORT = ENV.PORT || 5000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
    origin: ENV.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(cookieParser());
app.use(rateLimit);

app.get("/health", (req, res) => {
  res.status(200).send("Server is alive");
});

app.use('/api/auth', AuthRoutes);
app.use('/api/messages', MessageRoutes);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});

const SELF_URL = "https://chatly-app-meg2.onrender.com/health";

setInterval(async () => {
  try {
    const res = await axios.get(SELF_URL);
    console.log("Self ping success:", res.status);
  } catch (err) {
    console.log("Self ping failed:", err.message);
  }
}, 10 * 60 * 1000);