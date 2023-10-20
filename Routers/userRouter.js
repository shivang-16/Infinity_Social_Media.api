import express from "express";

import {
  register,
  login,
  updateUser,
  logout,
  deleteUser,
  getAllUsers,
  getMyProfile,
  verifyOtp,
  forgetPassword,
  changePassword,
  getUserbyID,
  getMyPosts,
  getUserPosts,
  deleteAvatar,
  getMyBookmarks
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

router.post("/register",singleUpload, register);
router.post("/verify", verifyOtp);
router.post("/login", login);
router.post("/forgetPassword", isAuthenticated, forgetPassword);
router.post("/changePassword", isAuthenticated, changePassword);
router.get("/myProfile", isAuthenticated, getMyProfile);
router.get("/logout", logout);
router.patch("/update", isAuthenticated, singleUpload, updateUser);
router.delete("/delete", isAuthenticated, deleteUser);
router.get("/all", getAllUsers);
router.post("/:id", getUserbyID);
router.route("/me/posts").get(isAuthenticated, getMyPosts);
router.route("/me/bookmarks").get(isAuthenticated, getMyBookmarks);
router.route("/posts/:id").get(isAuthenticated, getUserPosts);
router.get("/deleteAvatar", isAuthenticated, deleteAvatar)

export default router;
