const express = require('express');
const dotenv = require('dotenv');
const AuthRoutes = require('./routes/auth.route.js');
const connectDB = require('./utils/db.js');
// const MessageRoutes = require('./routes/message.route.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', AuthRoutes);
// app.use('/api/messages', MessageRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});