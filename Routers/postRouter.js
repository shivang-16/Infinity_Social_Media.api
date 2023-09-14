import express from 'express'
import { createPost } from '../controllers/postController.js'
import { getAllPost } from '../controllers/postController.js'
import { deletePost } from '../controllers/postController.js'
import { isAuthenticated } from '../middlewares/auth.js'

const router = express.Router()

router.post('/create',isAuthenticated, createPost)
router.get('/all', getAllPost)
router.route('/:id').delete(isAuthenticated, deletePost)

export default router