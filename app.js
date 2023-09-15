import express from 'express'
import userRouter from './Routers/userRouter.js';
import postRouter from './Routers/postRouter.js';
import followingRouter from './Routers/followingRouter.js'
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';

export const app = express();

config({
    path: './config.env',
  });

app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/user', userRouter)
app.use('/api/v1/post', postRouter)
app.use('/api/v1/following', followingRouter)

app.get('/', (req, res)=>{
    res.send('Server is working fine')
})
