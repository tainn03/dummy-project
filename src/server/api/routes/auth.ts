import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { ApiError } from "../middleware/error-handler";
import { AuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// Login route
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password) {
      throw new ApiError("Email and password are required", 400);
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new ApiError("Invalid credentials", 401);
    }

    // Check password
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError("Invalid credentials", 401);
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET || "fallback-jwt-secret",
      { expiresIn: "1d" }
    );

    // Set session (for session-based auth)
    if (req.session) {
      (req.session as typeof req.session & { userId?: string }).userId =
        user.id;
    }

    // Send response
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// Logout route
router.post("/logout", (req, res) => {
  // Clear session
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Failed to logout",
        });
      }

      res.clearCookie("connect.sid");
      res.json({
        success: true,
        message: "Logged out successfully",
      });
    });
  } else {
    res.json({
      success: true,
      message: "Already logged out",
    });
  }
});

// Change password route (protected)
router.put("/change-password", async (req: AuthRequest, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate request body
    if (!currentPassword || !newPassword) {
      throw new ApiError("Current password and new password are required", 400);
    }

    if (!req.user || !req.user.id) {
      throw new ApiError("Authentication required", 401);
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    // Verify current password
    const isCurrentPasswordValid = await compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      throw new ApiError("Current password is incorrect", 400);
    }

    // Hash new password
    const hashedPassword = await hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
});

// Register route (additional, not in requirements but useful)
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate request body
    if (!name || !email || !password) {
      throw new ApiError("Name, email, and password are required", 400);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ApiError("User with this email already exists", 409);
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET || "fallback-jwt-secret",
      { expiresIn: "1d" }
    );

    // Set session (for session-based auth)
    if (req.session) {
      (req.session as typeof req.session & { userId?: string }).userId =
        user.id;
    }

    // Send response
    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

export const authRouter = router;
