import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { getAllContacts, getContactsForDMList, searchContacts } from "../controllers/contacts.controllers.js";

const contactRoutes = Router();

contactRoutes.post("/search", authMiddleware, searchContacts);
contactRoutes.get("/get-contacts-for-dm", authMiddleware, getContactsForDMList);
contactRoutes.get("/get-all-contacts", authMiddleware, getAllContacts);

export default contactRoutes;