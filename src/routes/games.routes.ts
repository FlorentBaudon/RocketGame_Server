import express from 'express'
import * as GamesController from '../controller/games.controller'
import { checkToken } from '../middleware/jwtChecker'
import { RequestLimiter } from '../middleware/apiRateLimiter'

const router = express.Router()

router.get('/game', RequestLimiter, checkToken, GamesController.listGames)
router.get('/game/:id', RequestLimiter, checkToken, GamesController.getGameById)
router.put('/game/:id', RequestLimiter, checkToken, GamesController.updateGameId)

export default router
