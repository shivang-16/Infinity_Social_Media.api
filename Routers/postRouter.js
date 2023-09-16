import express from "express";
import {
  createPost,
  getAllPost,
  editPost,
  deletePost,
  likes,
  comments,
} from "../controllers/postController.js";

import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", isAuthenticated, createPost);
router.get("/all", getAllPost);
router
  .route("/:id")
  .put(isAuthenticated, editPost)
  .delete(isAuthenticated, deletePost);
router.route("/likes/:id").post(isAuthenticated, likes);
router.route("/comments/:id").post(isAuthenticated, comments);

export default router;
