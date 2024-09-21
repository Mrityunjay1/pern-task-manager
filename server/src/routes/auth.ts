import express from "express";
import { checkSession, login, logout, register } from "../models/authModel";

const authController = express.Router();

// Define routes for authentication
authController.post("/register", register);
authController.post("/login", login);
// authController.get("/verify", verifyUser);
authController.get("/check-session", (req, res) => {
  console.log("check-session route hit"); // Simple log to see if the route is being hit
  checkSession(req, res);
});
authController.post("/logout", logout);

export default authController;
