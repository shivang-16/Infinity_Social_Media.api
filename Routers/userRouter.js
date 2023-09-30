import express from "express";

import {
  register,
  login,
  updateUser,
  logout,
  deleteUser,
  getAllUsers,
  getMyProfile,
  verifyOtp
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();


router.post("/register", register);
router.post("/verify", verifyOtp)
router.post("/login", login);
router.get("/myProfile", isAuthenticated, getMyProfile);
router.post("/logout", isAuthenticated, logout);
router.patch("/update", isAuthenticated, updateUser);
router.delete("/delete", isAuthenticated, deleteUser);
router.get("/all", getAllUsers);

export default router;
