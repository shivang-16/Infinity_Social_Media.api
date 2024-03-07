import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  changeReadStatus,
  listAllNotification,
} from "../controllers/notificationContoller.js";

const router = express.Router();

// router.post('/create', isAuthenticated, createNotification)
router.get("/all", isAuthenticated, listAllNotification);
router.get("/read/:id", isAuthenticated, changeReadStatus);

export default router;
