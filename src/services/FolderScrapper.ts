import fs from 'fs/promises'
import path from 'path'
import * as GameQueries from './GameQueries'
import { IGameCard, IGameDoc } from '../types/game.types'
import logger from '../middleware/winston'
import { Game } from '../model/mongodb/game.model'

/*
  Scan folder to find new game
  All existing game in DB are ignored
*/

export async function ScanFolder(collectionFolder: string) {
  // collectionDir = path.resolve(CONFIG.server.gameFolder)
  console.log(`Scanning Folder!!! : ${collectionFolder}`)
  logger.info(`Scanning Folder : ${collectionFolder}`)

  try {
    const folders = await fs.readdir(collectionFolder)

    for (const folder of folders) {
      try {
        let id: string = await Game.findGameByFolder(folder)

        if (!id) {
          const resp = await GameQueries.searchGame(folder)
          id = resp.id
          logger.info(`######## Scan ${folder}`)

          let gameDetails: IGameDoc = {
            id: '',
            name: '',
            description: '',
            released: '',
            score: 0,
            background_image: '',
            developers: [],
            genres: [],
            screenshots: [],
            size: 0,
            gameFolder: '',
            gameFiles: [],
          }

          if (!id) {
            gameDetails.id = folder
            gameDetails.name = folder
            gameDetails.gameFolder = folder
          } else {
            logger.info(`- Create new game ${folder}`)
            gameDetails = await GameQueries.getGameById(id)
            gameDetails.screenshots = await GameQueries.getGameScreenshots(resp.id)
            gameDetails.gameFolder = folder
          }

          // check id found in provider already exist in database
          const bExist: boolean = await Game.gameIdExist(gameDetails.id)
          if (bExist) {
            gameDetails.id = gameDetails.gameFolder
          }

          gameDetails.gameFiles = await updateFilePath(collectionFolder, folder)

          const newGame = new Game(gameDetails)
          await newGame.save()
        } else {
          //If game exsiting we just update path of files
          const game: IGameDoc = await Game.getGame(id)
          // logger.info(`- Update game path ${folder}`)
          game.gameFiles = await updateFilePath(collectionFolder, game.gameFolder)
          const updatedGame = new Game(game)
          await updatedGame.save()
        }
      } catch (error) {
        logger.error(error)
      }
    }
  } catch (err) {
    logger.error(`Path for game folder : ${collectionFolder} - Not found `)
  } finally {
    logger.info('Finish Scan ##################')
  }
}
/*
 * Update all game datas but preserving ID's
 */
export async function UpdateGames(collectionFolder: string) {
  try {
    const gameList: IGameCard[] = await Game.listGames()

    for (const game of gameList) {
      logger.info(`Update ${game.name}`)
      let currentgame = await Game.getGame(game.id)
      const folder = currentgame.gameFolder

      currentgame = await GameQueries.getGameById(game.id)
      currentgame.gameFolder = folder
      currentgame.screenshots = await GameQueries.getGameScreenshots(game.id)

      currentgame.gameFiles = await updateFilePath(collectionFolder, currentgame.gameFolder)

      await Game.findOneAndReplace({ id: currentgame.id }, currentgame)
    }
    logger.info('Update Finished')
  } catch (error) {
    logger.error(error)
  }
}

async function updateFilePath(collectionFolder: string, folder: string): Promise<string[]> {
  const gameFiles = await readRecursively(collectionFolder, folder, path.resolve(collectionFolder, folder))
  return gameFiles
}

async function readRecursively(
  collectionFolder: string,
  gameFolder: string,
  currentDir: string,
  filelist: string[] = [],
): Promise<string[]> {
  const files: string[] = await fs.readdir(currentDir)

  for (const file of files) {
    const filepath = path.join(currentDir, file)
    const stat = await fs.stat(filepath)

    if (stat.isDirectory()) {
      filelist = await readRecursively(collectionFolder, gameFolder, filepath, filelist)
    } else {
      let r: string = filepath
      r = r.split(path.sep).join(path.posix.sep)
      r = r.replace(`${collectionFolder}/${gameFolder}/`, '')
      filelist.push(r)
    }
  }

  return filelist
}
