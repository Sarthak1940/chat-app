import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import {renameSync, unlinkSync} from "fs"

const maxAge = 3 * 24 * 60 * 60;

const createToken = (userId) => {
  return jwt.sign({userId}, process.env.JWT_SECRET, { expiresIn: maxAge });
}

const isProduction = process.env.NODE_ENV === 'production';

const options = {
  sameSite: isProduction ? "None" : "Lax",
  secure: isProduction, 
  expiresIn: maxAge
}

export const signup = async (req, res) => {
  const {email, password} = req.body;

  try {

    if (!email || !password) {
      return res.status(400).send("Please provide email and password");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    const user = await User.create({email, password});

    const token = createToken(user._id);

    res.cookie('jwt', token, options);
    return res.status(201).json({message: "User created", user: {
      _id: user._id,
      email: user.email,
      profileSetup: user.profileSetup,
    }});

  } catch (error) {
    console.log(error);
    return res.status(500).send("Error signing up");
  }
}

export const login = async (req, res) => {
  const {email, password} = req.body;

  try {

    if (!email || !password) {
      return res.status(400).send("Please provide email and password");
    }

    const user = await User.findOne({email});

    if (!user) {
      return res.status(404).send("User does not exist");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      return res.status(401).send("Password is incorrect");
    }

    const token = createToken(user._id);

    res.cookie('jwt', token, options);
    return res.status(200).json({message: "Login successful", user: {
      _id: user._id,
      email: user.email,
      profileSetup: user.profileSetup,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      color: user.color
    }});

  } catch (error) {
    console.log(error);
    return res.status(500).send("Error logging in");
  }
}

export const getUserInfo = async (req, res) => {
  const userId = req.userId;
  
  try {
    const user = await User.findById(userId).select("-password");
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error fetching user data");
  }
}

export const updateProfile = async (req, res) => {
  const userId = req.userId;
  const {firstName, lastName, color} = req.body;

  try {
    if (!firstName || !lastName) {
      return res.status(400).send("Please provide first name, last name and color");
    }
    
    
    const user = await User.findByIdAndUpdate(userId, 
      {firstName, lastName, color, profileSetup: true},
      {new: true, runValidators: true}
    ).select("-password");
    
    

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error updating profile");
  }
}

export const updateImage = async (req, res) => {
  const file = req.file;

  try {
    if (!file) {
      return res.status(400).send("File is required");
    }

    const date = Date.now();
    let fileName = "uploads/profiles/" + date + req.file.originalname;
    renameSync(req.file.path, fileName);

    const user = await User.findByIdAndUpdate(req.userId, {
      image: fileName
    }, {
      new: true,
      runValidators: true
    })
    
    return res.status(200).json({image: user.image});
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error updating profile");
  }
}

export const removeProfileImage = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (user.image) {
      unlinkSync(user.image);
    }

    user.image = null;
    await user.save();

    return res.status(200).send("Image removed successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).send("error deleting image");
  }
}

export const logout = (req, res) => {
  try {
    res.cookie('jwt', '', {
      maxAge: 1,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax"
    });
    return res.status(200).send("Logged out successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error logging out");   
  }
}