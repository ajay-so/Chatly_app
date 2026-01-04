const express = require('express');
const dotenv = require('dotenv');
const AuthRoutes = require('./routes/auth.route.js');
const connectDB = require('./utils/db.js');
const cookieParser = require('cookie-parser');
const rateLimit = require('./middlewares/rateLimit.middleware.js');
const MessageRoutes = require('./routes/message.route.js');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(cookieParser());
app.use(rateLimit);


app.use('/api/auth', AuthRoutes);
app.use('/api/messages', MessageRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});