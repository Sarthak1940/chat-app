import User from "../models/user.models.js";
import Channel from "../models/channel.models.js";
import mongoose from "mongoose";

export const createChannel = async (req, res) => {
  const {name, members} = req.body;
  const userId = req.userId;

  try {
    const admin = await User.findById(userId);

    if (!admin) {
      return res.status(404).json({message: "Admin not found"});
    }

    const validatedMembers = await User.find({_id: {$in: members}});

    if (validatedMembers.length !== members.length) {
      return res.status(404).json({message: "Some members are not valid users"});
    }

    const newChannel = await Channel.create({
      name,
      admin: userId,
      members
    })

    return res.status(200).json({channel: newChannel});

  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Could not create channel"});
  }
}

export const getChannels = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);

    const channels = await Channel.find({
      $or: [{admin: userId}, {members: userId}]
    }).sort({updatedAt: -1});

    return res.status(200).json({channels});

  } catch (error) {
    console.log(error);
    return res.status(500).json({message: "Error fetching channels"});
  }
}

export const getChannelMessages = async (req, res) => {
  const {channelId} = req.params;

  try {
    const channel = await Channel.findById(channelId).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "firstName lastName email _id color image"
      }
    });

    if (!channel) {
      return res.status(404).json({message: "Channel not found"});
    }

    const messages = channel.messages;
    return res.status(200).json({messages});
  } catch (error) {
    console.log(error);
    return res.status(500).json({message: "Error fetching channel messages"});
  }
}