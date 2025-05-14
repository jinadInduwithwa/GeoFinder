// server.js
import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

// Routers
import authRouter from "./routes/authRouter.js";
import restCountryAPIRoute from "./routes/restCountryAPIRoute.js";
import favoriteRoutes from "./routes/favoritesRouter.js";

// Public
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

// Middleware
import errorHandelerMiddleware from "./middleware/errorHandelerMiddleware.js";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Enable CORS for requests from the frontend
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true, // Allow cookies
  })
);

// Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(cookieParser());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.get("/api/v1/test", (req, res) => {
  res.json({ msg: "Test route" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/countries", restCountryAPIRoute);
app.use('/api/v1/favorites', favoriteRoutes);

// 404 Route
app.use((req, res) => {
  res.status(404).json({ msg: "route not found" });
});

// Error-handling middleware
app.use(errorHandelerMiddleware);

// Start server after MongoDB connection
const startServer = async () => {
  try {
    console.log("MONGO_URL:", process.env.MONGO_URL);
    console.log("BASE_URL:", process.env.BASE_URL);
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

startServer();