import { Router } from "express";
import { signup , login, getUserInfo, updateProfile, updateImage, removeProfileImage, logout} from "../controllers/auth.controllers.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import multer from "multer"

const authRoutes = Router();
const upload = multer({dest: "uploads/profiles/"});

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/userInfo", authMiddleware, getUserInfo);
authRoutes.post("/updateProfile", authMiddleware, updateProfile);
authRoutes.post("/updateImage", authMiddleware, upload.single("profile-image"), updateImage);
authRoutes.delete("/remove-profile-image", authMiddleware, removeProfileImage);
authRoutes.post("/logout", logout);

export default authRoutes;