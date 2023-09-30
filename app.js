import express from "express";
import userRouter from "./Routers/userRouter.js";
import postRouter from "./Routers/postRouter.js";
import followRouter from "./Routers/followRouter.js";
import cookieParser from "cookie-parser";
import { config } from "dotenv";

export const app = express();

config({
  path: "./data/config.env",
});
// console.log(process.env.TWILIO_ACCOUNT_SID)
// console.log(process.env.JWT_SECRET)
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/follow", followRouter);

app.get("/", (req, res) => {
  res.send("Server is working fine");
});
