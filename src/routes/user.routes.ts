import express from 'express'
import * as UsersController from '../controller/login.controller'
import { checkToken } from '../middleware/jwtChecker'
import { LoginLimiter } from '../middleware/apiRateLimiter'

const router = express.Router()

router.get('/user', checkToken, UsersController.checkUser)
router.post('/user/signin', LoginLimiter, UsersController.signin)
router.post('/user', LoginLimiter, UsersController.signup)
router.put('/user', LoginLimiter, checkToken, UsersController.updateUser)

export default router
