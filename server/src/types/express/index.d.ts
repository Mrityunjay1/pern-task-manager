import express from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: number; // Add the userId property to the Request type
    }
  }
}
