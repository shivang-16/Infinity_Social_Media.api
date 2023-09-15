import express from 'express'
import { following } from '../controllers/following.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

router.route('/:id').post(isAuthenticated, following)

export default router