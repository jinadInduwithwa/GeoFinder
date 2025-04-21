import express from "express";
import { addFavorite, getFavorites, removeFavorite } from "../Controller/favoritesController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .post(authenticateUser, addFavorite)
  .get(authenticateUser, getFavorites);
router.route("/remove").post(authenticateUser, removeFavorite);

export default router;