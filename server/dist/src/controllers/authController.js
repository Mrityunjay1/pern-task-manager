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
exports.default = authController;
