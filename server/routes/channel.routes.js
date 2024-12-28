import {Router} from 'express';
import { createChannel, getChannelMessages, getChannels } from '../controllers/channel.controllers.js';
import authMiddleware from "../middlewares/auth.middleware.js"

const channelRoutes = Router();

channelRoutes.post("/create-channel", authMiddleware, createChannel);
channelRoutes.get("/get-channels", authMiddleware, getChannels);
channelRoutes.get("/get-channel-messages/:channelId", authMiddleware, getChannelMessages);

export default channelRoutes