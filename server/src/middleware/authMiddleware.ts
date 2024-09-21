// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export const verifyUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
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
//       return res.redirect(process.env.CLIENT_AUTH_URL as string);
//     }
//     req.userId = user.userId;
//     next();
//   } catch (error) {
//     console.error("Verification error:", error);
//     return res
//       .status(500)
//       .json({ message: "An error occurred during verification" });
//   }
// };
