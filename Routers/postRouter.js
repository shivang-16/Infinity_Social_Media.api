import express from 'express'
import { createPost } from '../controllers/postController.js'
import { getAllPost } from '../controllers/postController.js'
import { editPost } from '../controllers/postController.js'
import { deletePost } from '../controllers/postController.js'
import { likes } from '../controllers/postController.js'
import { comments } from '../controllers/postController.js'
import { isAuthenticated } from '../middlewares/auth.js'

const router = express.Router()

router.post('/create',isAuthenticated, createPost)
router.get('/all', getAllPost)
router.route('/:id').put(isAuthenticated, editPost).delete(isAuthenticated, deletePost)
router.route('/likes/:id').post(isAuthenticated, likes)
router.route('/comments/:id').post(isAuthenticated, comments)

export default router