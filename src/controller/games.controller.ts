import { Request, Response } from 'express'
import { Game } from '../model/mongodb/game.model'
import { IGameCard, IGameDoc } from '../types/game.types'
import logger from '../middleware/winston'
import * as GameQueries from '../services/GameQueries'

export async function listGames(req: Request, res: Response) {
  try {
    const gameList: IGameCard[] = await Game.listGames()
    res.json(gameList)
  } catch (error) {
    logger.error(error)
    res.status(404).send('No games found')
  }
}

export async function getGameById(req: Request, res: Response) {
  try {
    const id: string = req.params.id
    const game: IGameDoc = await Game.getGame(id)
    res.json(game)
  } catch (error) {
    logger.error(error)
    res.status(404).send('Game not found')
  }
}

export async function updateGameId(req: Request, res: Response) {
  if (!req.body.user || !req.body.user.isAdmin) {
    res.status(401).send('Unauthorize')
  }

  const currentId: string = req.params.id
  const newId: string = req.body.newGameID

  if (!newId) {
    res.status(501).send('New Game ID missing')
  }

  try {
    let game: IGameDoc = await Game.getGame(currentId)
    const gameFolder = game.gameFolder
    const gameFiles = game.gameFiles
    game = await GameQueries.getGameById(newId)
    game.screenshots = await GameQueries.getGameScreenshots(newId)
    game.gameFolder = gameFolder
    game.gameFiles = gameFiles

    await Game.findOneAndUpdate({ id: currentId }, game)

    res.status(200).send('Game updated')
  } catch (error) {
    logger.error(error)
    res.status(404).send('Game not found')
  }
}
