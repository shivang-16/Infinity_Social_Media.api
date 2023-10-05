import express from "express";
import userRouter from "./Routers/userRouter.js";
import postRouter from "./Routers/postRouter.js";
import followRouter from "./Routers/followRouter.js";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import cors from "cors";


export const app = express();

config({
  path: "./data/config.env",
});
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);


app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/follow", followRouter);

app.get("/", (req, res) => {
  res.send("Server is working fine");
});
