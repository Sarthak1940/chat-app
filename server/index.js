import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes.js';
import contactRoutes from './routes/contact.routes.js';
import setupSocket from './socket.js';
import messageRoutes from './routes/messages.routes.js';
import channelRoutes from "./routes/channel.routes.js"

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

const DATABASE_URL = process.env.DATABASE_URL;

app.use(cors({
        origin: [process.env.FRONTEND_URL],
        methods: ['GET', 'POST', 'DELETE'],
        credentials: true
    }
));

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());

app.use(express.json());

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/contacts", contactRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/channels", channelRoutes);

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

setupSocket(server);

mongoose.connect(DATABASE_URL).then(() => {
    console.log('Connected to the database');
}).catch((error) => {
    console.log('Error connecting to the database', error);
})