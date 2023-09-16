import express from "express";
import {
  register,
  login,
  updateUser,
  logout,
  deleteUser,
  getUserProfile,
  getAllUsers,
  getMyProfile,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/myProfile", isAuthenticated, getMyProfile);
router.post("/logout", isAuthenticated, logout);
router.get("/all", getAllUsers);
router.route("/profile/:userName").get(getUserProfile);
router.route("/:id").put(updateUser).delete(deleteUser);

export default router;
