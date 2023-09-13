import express from 'express'
import { register } from '../controllers/userController.js'
import { login } from '../controllers/userController.js'
import { updateUser } from '../controllers/userController.js'
import { logout } from '../controllers/userController.js'
import { deleteUser } from '../controllers/userController.js'
import { getUserProfile } from '../controllers/userController.js'
import { getAllUsers } from '../controllers/userController.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/all', getAllUsers)
router.route('/profile/:userName').get(getUserProfile)
router.route('/:id').put(updateUser).delete(deleteUser)




export default router