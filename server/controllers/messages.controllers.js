import Message from "../models/messages.models.js";
import {mkdirSync, renameSync} from "fs";

export const getAllMessages = async (req, res) => {
  const user1 = req.userId;
  const user2 = req.body.id;  
  try {
    
    if (!user1 || !user2) {
      return res.status(400).json({ message: "Both users are required" });
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 }
      ]
    }).sort({ timestamp: 1 });

    return res.status(200).json({messages});

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not fetch messages" });
  }
}

export const uploadFiles = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const date = Date.now();
    const fileDir = `uploads/files/${date}`
    let fileName = `${fileDir}/${req.file.originalname}`;

    mkdirSync(fileDir, { recursive: true });

    renameSync(req.file.path, fileName);

    return res.status(200).json({ message: "Files uploaded successfully", filePath: fileName });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not upload files" });
  }
}