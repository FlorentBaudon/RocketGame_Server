import axios from 'axios'
import logger from '../middleware/winston'
import { IGameDoc } from '../types/game.types'
import { getConfig } from '../tools/ConfigFile'
import * as FormatTool from '../tools/FormatTool'

const CONFIG = getConfig()

const API_KEY = CONFIG.server.RAWG_API_KEY

axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return Promise.reject(`${error.response.status} - ${error.response.data.error}`)
  },
)

export async function searchGame(gameName: string) {
  gameName = FormatTool.formatGameName(gameName)

  const req = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.rawg.io/api/games?key=${API_KEY}&search=${gameName}&platforms=4&stores=5`,
    headers: {},
  }

  const resp = await axios.request(req)

  if (resp.status == 200) {
    if (resp.data.count > 0) {
      return resp.data.results[0]
    } else {
      logger.info(`Game "${gameName}" not found`)
      return ''
    }
  } else {
    throw `${resp.status} - ${resp.data}`
  }
}

export async function getGameById(id: string): Promise<IGameDoc> {
  const req = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.rawg.io/api/games/${id}?key=${API_KEY}`,
    headers: {},
  }
  try {
    const resp = await axios.request(req)

    if (resp.status == 200) {
      const game: IGameDoc = {
        id: resp.data.id,
        name: resp.data.name,
        description: resp.data.description,
        released: resp.data.released,
        score: resp.data.metacritic,
        background_image: resp.data.background_image,
        developers: [],
        genres: [],
        screenshots: [],
        size: 0,
        gameFolder: '',
        gameFiles: [],
      }
      resp.data.developers?.forEach((dev: any) => {
        game.developers.push(dev.name)
      })

      resp.data.genres?.forEach((genre: any) => {
        game.genres.push(genre.name)
      })

      return game
    } else {
      throw TypeError(`${resp.status} - ${resp.data}`)
    }
  } catch (error) {
    logger.error(error)
    throw error
  }
}

export async function getGameScreenshots(id: string): Promise<string[]> {
  const req = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.rawg.io/api/games/${id}/screenshots?key=${API_KEY}`,
    headers: {},
  }
  try {
    const resp = await axios.request(req)
    const screenshot: string[] = []

    if (resp.status == 200) {
      resp.data.results.forEach((genre: any) => {
        screenshot.push(genre.image)
      })

      return screenshot
    } else {
      throw TypeError(`${resp.status} - ${resp.data}`)
    }
  } catch (error) {
    logger.error(error)
    throw error
  }
}
