import { Request, Response } from 'express'
import { ScanFolder, UpdateGames } from '../services/FolderScrapper'
import { getConfig } from '../tools/ConfigFile'

const CONFIG = getConfig()

export async function scanCollection(req: Request, res: Response) {
  if (req.body.user && req.body.user.isAdmin) {
    for (const f of CONFIG.server.gameFolders) {
      ScanFolder(f)
    }
    res.send('Scanning signal send')
  } else {
    res.status(401).send('Unauthorize')
  }
}

export async function updateCollection(req: Request, res: Response) {
  if (req.body.user && req.body.user.isAdmin) {
    for (const f of CONFIG.server.gameFolders) {
      UpdateGames(f)
    }
    res.send('Update signal send')
  } else {
    res.status(401).send('Unauthorize')
  }
}
