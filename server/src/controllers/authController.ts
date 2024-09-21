import express from "express";
import { login, register } from "../models/authModel";

const authController = express.Router();

// Define routes for authentication
authController.post("/register", register);
authController.post("/login", login);

export default authController;
