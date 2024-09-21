"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.checkSession = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const generateToken = (user) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    return jsonwebtoken_1.default.sign({ id: user.userId, username: user.username, email: user.email }, secret, { expiresIn: "1d" } // Token expires in 1 day
    );
};
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, profilePictureUrl = null } = req.body;
    if (!email || !password || !username) {
        return res
            .status(400)
            .json({ message: "Username, email, and password are required" });
    }
    try {
        const existingUser = yield prisma.user.findFirst({
            where: { OR: [{ email }, { username }] },
        });
        if (existingUser) {
            return res
                .status(409)
                .json({ message: "Email or username is already in use" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield prisma.user.create({
            data: { username, email, profilePictureUrl, password: hashedPassword },
        });
        const token = generateToken(user);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.userId,
                username: user.username,
                email: user.email,
                profilePictureUrl: user.profilePictureUrl,
            },
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        return res
            .status(500)
            .json({ message: "An error occurred during registration" });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    try {
        const user = yield prisma.user.findFirst({
            where: { email },
        });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const token = generateToken(user);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none", // Allows cross-origin cookie sharing
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user.userId,
                username: user.username,
                email: user.email,
                profilePictureUrl: user.profilePictureUrl,
            },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "An error occurred during login" });
    }
});
exports.login = login;
// export const verifyUser = async (req: Request, res: Response) => {
//   const token = req.cookies.token;
//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!);
//     if (!decoded) {
//       return res.redirect(process.env.CLIENT_AUTH_URL as string);
//     }
//     const user = await prisma.user.findUnique({
//       where: { userId: (decoded as any).id },
//     });
//     if (!user) {
//         return res.redirect(process.env.CLIENT_AUTH_URL as string);
//     }
//     return res.status(200).json({
//       message: "User verified",
//       user: {
//         id: user.userId,
//         username: user.username,
//         email: user.email,
//         profilePictureUrl: user.profilePictureUrl,
//       },
//     });
//   } catch (error) {
//     console.error("Verification error:", error);
//     return res
//       .status(500)
//       .json({ message: "An error occurred during verification" });
//   }
// };
const checkSession = (req, res) => {
    var _a;
    // Log the cookies to ensure they're being received correctly
    console.log("Cookies:", req.cookies);
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token; // Ensure cookies are parsed correctly
    if (!token) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({ message: "Authenticated", user: decoded });
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
exports.checkSession = checkSession;
const logout = (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
};
exports.logout = logout;
