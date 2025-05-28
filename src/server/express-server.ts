import express from "express";
import cors from "cors";
import { createClient } from "redis";
import session from "express-session";
import { RedisStore } from "connect-redis";
import { authRouter } from "./api/routes/auth";
import { taskRouter } from "./api/routes/tasks";
import { errorHandler } from "./api/middleware/error-handler";
import { authMiddleware } from "./api/middleware/auth";

// Initialize Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
    console.log("✅ Redis connected successfully");
  } catch (error) {
    console.error("❌ Redis connection error:", error);
  }
})();

// Create Redis store for sessions
const redisStore = new RedisStore({
  client: redisClient,
  prefix: "task-manager:",
});

// Create Express server
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Session management
app.use(
  session({
    store: redisStore,
    secret: process.env.SESSION_SECRET || "task-manager-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Routes
app.use("/auth", authRouter);
app.use("/tasks", authMiddleware, taskRouter);

// Error handler
app.use(errorHandler);

// Start server
export const startExpressServer = () => {
  app.listen(PORT, () => {
    console.log(`✅ Express server running on http://localhost:${PORT}`);
  });
};

// Handle graceful shutdown
process.on("SIGINT", async () => {
  await redisClient.quit();
  console.log("Redis client disconnected");
  process.exit(0);
});

// If file is run directly
if (require.main === module) {
  startExpressServer();
}
