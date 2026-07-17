import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import "./models/document.model.js";
import "./models/associations.js";

import { sequelize } from "./config/database.js";

import documentRoutes from "./api/routes/document.routes.js";
import authRoutes from "./api/routes/auth.routes.js";

const app = express();

// Security middleware
app.use(helmet());

// Enable CORS for frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);

// Logging
app.use(morgan("dev"));

// Parse JSON
app.use(express.json());

// Parse URL encoded data
app.use(express.urlencoded({ extended: true }));

// Static files (uploaded documents)
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/documents", documentRoutes);
app.use("/api/auth", authRoutes);

// Health check
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "translator-api",
  });
});

// Error handler (should be last)
app.use(
  (
    err: Error & { statusCode?: number; statusMessage?: string },
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    res.status(err?.statusCode ?? 500).json({
      message: err?.statusMessage ?? "Internal server error",
    });
  },
);

sequelize
  .sync()
  // .sync({ force: true })
  .then((result) => {
    const server = app.listen(4000, () => {
      console.log("Server is up on port 4000");
    });
  })
  .catch((err) => {
    console.log("sequelize err:", err);
  });
