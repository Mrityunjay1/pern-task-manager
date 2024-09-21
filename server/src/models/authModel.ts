import bcrypt from "bcrypt";
import { PrismaClient, User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const generateToken = (user: User): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign(
    { id: user.userId, username: user.username, email: user.email },
    secret,
    { expiresIn: "1d" } // Token expires in 1 day
  );
};

export const register = async (req: Request, res: Response) => {
  const { username, email, password, profilePictureUrl = null } = req.body;

  if (!email || !password || !username) {
    return res
      .status(400)
      .json({ message: "Username, email, and password are required" });
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email or username is already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
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
  } catch (error) {
    console.error("Registration error:", error);
    return res
      .status(500)
      .json({ message: "An error occurred during registration" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const user = await prisma.user.findFirst({
      where: { email },
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
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
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "An error occurred during login" });
  }
};

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

export const checkSession = (req: Request, res: Response) => {
  // Log the cookies to ensure they're being received correctly
  console.log("Cookies:", req.cookies);

  const token = req.cookies?.token; // Ensure cookies are parsed correctly

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return res.status(200).json({ message: "Authenticated", user: decoded });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logged out successfully" });
};
