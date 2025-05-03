import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

// Routers
import authRouter from "./routes/authRouter.js";
import restCountryAPIRoute from "./routes/restCountryAPIRoute.js";
import favoriteRoutes from "./routes/favoritesRouter.js";

// Middleware
import errorHandelerMiddleware from "./middleware/errorHandelerMiddleware.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// Enable CORS for production and development
const corsOptions = {
  origin: process.env.NODE_ENV === "production" ? process.env.CLIENT_URL : "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(cookieParser());
app.use(express.json());

// Serve static files from Client/dist in production
app.use(express.static(path.join(__dirname, "Client", "dist")));

// Serve public assets (if needed)
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/api/v1/test", (req, res) => {
  res.json({ msg: "Test route" });
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/countries", restCountryAPIRoute);
app.use("/api/v1/favorites", favoriteRoutes);

// Fallback to index.html for SPA routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "Client", "dist", "index.html"));
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
    app.listen(process.env.PORT || 5100, () => {
      console.log(`Server is running on port ${process.env.PORT || 5100}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

startServer();