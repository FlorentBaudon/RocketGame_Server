import { Request, Response } from 'express'
import { getConfig } from '../tools/ConfigFile'
import path from 'path'
import logger from '../middleware/winston'
import * as authTool from '../services/authTools'

const CONFIG = getConfig()

export function downloadFile(req: Request, res: Response) {
  const file: string = req.query.file as string
  console.log(file)
  // const folder: string = req.params.folder
  // console.log(req.body.file)
  const gameFolder = CONFIG.server.gameFolder
  const filePath = path.resolve(gameFolder, file)

  logger.info(filePath)

  res.download(filePath, err => {
    if (err) {
      logger.error(err)
      res.send(err)
    }
  })
}

// give temporary token for download
export function getDownloadToken(req: Request, res: Response) {
  if (req.body.user) {
    const token: string = authTool.createDownloadToken(req.body.user._id)
    res.status(200).send(token)
  } else {
    res.status(401).send('Unauthorize')
  }
}
