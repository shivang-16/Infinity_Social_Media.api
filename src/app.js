import express from "express";
import userRouter from "./Routers/userRouter.js";
import postRouter from "./Routers/postRouter.js";
import followRouter from "./Routers/followRouter.js";
import notificationRouter from "./Routers/notificationRouter.js";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import cors from "cors";

export const app = express();

config({
  path: "./.env",
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/follow", followRouter);
app.use("/api/v1/notification", notificationRouter);

app.get("/", (req, res) => {
  res.send("Server is working fine");
});
