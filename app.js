import express from 'express'
import userRouter from './Routers/userRouter.js';
import { config } from 'dotenv';

export const app = express();

config({
    path: './config.env',
  });

app.use(express.json());
app.use('/api/v1/user', userRouter)
app.get('/', (req, res)=>{
    res.send('Server is working fine')
})
