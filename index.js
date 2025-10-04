import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import {
  globalErrorHandler,
  notFoundHandler,
} from "./src/middleware/errorHandler.js";
import { successResponse, errorResponse } from "./src/lib/responseUtils.js";

// Import routes
import exampleRoutes from "./src/routes/exampleRoutes.js";
import db from "./src/lib/db.js";
import { connectToRedis } from "./src/lib/redis.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/", (req, res) => {
  successResponse(res, null, "The service is healthy and running!");
});

// Routes
app.use("/api/example", exampleRoutes);

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Global error handler - must be last
app.use(globalErrorHandler);

db()
  .then(() => {
    connectToRedis().catch((err) => {
      console.error("Failed to connect to Redis", err);
      process.exit(1);
    });
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
    process.exit(1);
  });
