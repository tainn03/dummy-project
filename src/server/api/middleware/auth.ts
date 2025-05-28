import { Request, Response, NextFunction } from "express";
import type { Session } from "express-session";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { ApiError } from "./error-handler";

const prisma = new PrismaClient();

// Extended Request type to include user information
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

// Authentication middleware to protect routes
export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if session exists (if using session-based auth)
    if (req.session && (req.session as Session & { userId?: string }).userId) {
      const userId = (req.session as Session & { userId?: string }).userId;
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true },
      });

      if (user) {
        req.user = user;
        return next();
      }
    }

    // Check for JWT in authorization header (token-based auth)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError("Authentication required", 401);
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || "fallback-jwt-secret";

    try {
      const decoded = jwt.verify(token, secret) as {
        id: string;
        email: string;
        name: string;
      };

      // Check if user exists in database
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, name: true },
      });

      if (!user) {
        throw new ApiError("User not found", 401);
      }

      // Attach user info to request
      req.user = user;
      next();
    } catch {
      throw new ApiError("Invalid or expired token", 401);
    }
  } catch (error) {
    next(error);
  }
};
