import {Router} from 'express';
import { getAllMessages, uploadFiles } from '../controllers/messages.controllers.js';
import authMiddleware from "../middlewares/auth.middleware.js"
import multer from 'multer';

const messageRoutes = Router();
const upload = multer({dest: 'uploads/files'});

messageRoutes.post("/get-messages", authMiddleware, getAllMessages);
messageRoutes.post("/upload-files", authMiddleware, upload.single('file'), uploadFiles);

export default messageRoutes;