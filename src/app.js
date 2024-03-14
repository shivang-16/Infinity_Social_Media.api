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
const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  let isDomainAllowed = req.header('Origin') && req.header('Origin').match(/^https?:\/\/social-media-app\./);
  let isLocalhostAllowed = req.header('Origin') === 'http://localhost:5173';

  if (isDomainAllowed || isLocalhostAllowed) {
    corsOptions = { origin: true, credentials: true }; // Reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // Disable CORS for this request
  }
  callback(null, corsOptions); // Callback expects two parameters: error and options
};

app.use(cors(corsOptionsDelegate));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/follow", followRouter);
app.use("/api/v1/notification", notificationRouter);

app.get("/", (req, res) => {
  res.send("Server is working fine");
});
