// routes/authRouter.js
import express from "express";
import {
  register,
  login,
  logout,
  getCurrentUser,
} from "../Controller/authController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticateUser, getCurrentUser);

export default router;