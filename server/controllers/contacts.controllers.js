import Message from "../models/messages.models.js";
import User from "../models/user.models.js";
import mongoose from "mongoose";

export const searchContacts = async (req, res) => {
  const { searchTerm } = req.body;

  try {
    if (!searchTerm) {
      return res.status(400).json({ message: "Search term is required" });
    }

    const sanitizedSearchTerm = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const regex = new RegExp(sanitizedSearchTerm, "i");

    const contacts = await User.find({
      $and: [{_id: {$ne: req.userId}}, 
        {$or: [{firstName: regex}, {lastName: regex}, {email: regex}]}
      ]
    })

    return res.status(200).json({ contacts });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error searching contacts");
  }
}

export const getContactsForDMList = async (req, res) => {
  let userId = req.userId;

  try {
    userId = new mongoose.Types.ObjectId(userId);

    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [{sender: userId}, {recipient: userId}]
        }
      },
      {
        $sort: {timestamp: -1}
      },
      {
        $group: {
          _id: {
            $cond: {
              if: {$eq: ["$sender", userId]},
              then: "$recipient",
              else: "$sender"
            }
          },
          lastMessageTime: {$first: "$timestamp"}
        }
      },
      {
        $lookup: {
          from: "users", 
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo"
        }
      }, 
      {
        $unwind: "$contactInfo"
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          image: "$contactInfo.image",
          color: "$contactInfo.color"
        }
      },
      {
        $sort: {lastMessageTime: -1}
      }
    ]);

    return res.status(200).json({ contacts });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not fetch contacts" });
  }
}

export const getAllContacts = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } }).select("firstName lastName _id email");

    const contacts = users.map(user => ({
      label: `${user.firstName ? `${user.firstName} ${user.lastName}` : user.email}`,
      value: user._id
    }))

    return res.status(200).json({ contacts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Could not fetch contacts" });
  }
}