"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authModel_1 = require("../models/authModel");
const authController = express_1.default.Router();
// Define routes for authentication
authController.post("/register", authModel_1.register);
authController.post("/login", authModel_1.login);
// authController.get("/verify", verifyUser);
authController.get("/check-session", (req, res) => {
    console.log("check-session route hit"); // Simple log to see if the route is being hit
    (0, authModel_1.checkSession)(req, res);
});
authController.post("/logout", authModel_1.logout);
exports.default = authController;
