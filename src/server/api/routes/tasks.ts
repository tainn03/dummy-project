import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { ApiError } from "../middleware/error-handler";
import { AuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// Get all tasks (with filter & sort)
router.get("/", async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError("Authentication required", 401);
    }

    const { status, sortBy = "createdAt", sortDir = "desc" } = req.query;

    // Build filter
    const filter: any = {
      createdBy: req.user.id,
    };

    // Add status filter if provided
    if (status) {
      filter.status = status;
    }

    // Build sort
    const orderBy: any = {};
    if (sortBy === "deadline") {
      orderBy.deadline = sortDir === "asc" ? "asc" : "desc";
    } else {
      orderBy.createdAt = sortDir === "asc" ? "asc" : "desc";
    }

    // Get tasks
    const tasks = await prisma.task.findMany({
      where: filter,
      orderBy,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
});

// Get task detail
router.get("/:id", async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError("Authentication required", 401);
    }

    const { id } = req.params;

    // Find task
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Check if task exists
    if (!task) {
      throw new ApiError("Task not found", 404);
    }

    // Check if user has access to task
    if (task.createdBy !== req.user.id) {
      throw new ApiError("Not authorized to access this task", 403);
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
});

// Create new task
router.post("/", async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError("Authentication required", 401);
    }

    const { title, description, status, deadline } = req.body;

    // Validate request body
    if (!title) {
      throw new ApiError("Title is required", 400);
    }

    // Create task
    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        status: status || "pending",
        deadline: deadline ? new Date(deadline) : null,
        createdBy: req.user.id,
      },
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
});

// Update task
router.put("/:id", async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError("Authentication required", 401);
    }

    const { id } = req.params;
    const { title, description, status, deadline } = req.body;

    // Find task
    const task = await prisma.task.findUnique({
      where: { id },
    });

    // Check if task exists
    if (!task) {
      throw new ApiError("Task not found", 404);
    }

    // Check if user has access to task
    if (task.createdBy !== req.user.id) {
      throw new ApiError("Not authorized to update this task", 403);
    }

    // Update task
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: title || undefined,
        description: description !== undefined ? description : undefined,
        status: status || undefined,
        deadline: deadline ? new Date(deadline) : undefined,
      },
    });

    res.json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
});

// Delete task
router.delete("/:id", async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError("Authentication required", 401);
    }

    const { id } = req.params;

    // Find task
    const task = await prisma.task.findUnique({
      where: { id },
    });

    // Check if task exists
    if (!task) {
      throw new ApiError("Task not found", 404);
    }

    // Check if user has access to task
    if (task.createdBy !== req.user.id) {
      throw new ApiError("Not authorized to delete this task", 403);
    }

    // Delete task
    await prisma.task.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

export const taskRouter = router;
