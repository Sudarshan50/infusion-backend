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

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan("dev"));
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check route
app.get("/", (req, res) => {
    successResponse(res,null,"The service is healthy and running!");
});



// Routes
app.use("/api/example", exampleRoutes);

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Global error handler - must be last
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
});
