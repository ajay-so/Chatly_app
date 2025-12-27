import express from 'express';
import dotenv from 'dotenv';
import AuthRoutes from './routes/auth.route.js';
// import MessageRoutes from './routes/message.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/api/auth', AuthRoutes);
// app.use('/api/messages', MessageRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});