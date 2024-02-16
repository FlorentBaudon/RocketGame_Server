import express from 'express'
import { scanCollection, updateCollection } from '../controller/collections.controller'
import { checkToken } from '../middleware/jwtChecker'
import { LoginLimiter } from '../middleware/apiRateLimiter'

const router = express.Router()

router.post('/scan', LoginLimiter, checkToken, scanCollection)
router.put('/scan', LoginLimiter, checkToken, updateCollection)

export default router
