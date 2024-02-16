/**
 * @file
 * @version 0.0.1
 * @date 14/11/2023
 * @author Florent Baudon
 * @copyright Florent Baudon
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

import { getConfig, checkConfigFile } from './tools/ConfigFile'
checkConfigFile()

import express, { Express } from 'express'
import collectionsRoutes from './routes/collections.routes'
import gamesRoutes from './routes/games.routes'
import authRoutes from './routes/user.routes'
import logger from './middleware/winston'
import * as DB from './services/mongoDBConnector'
import * as FolderScrapper from './services/FolderScrapper'
import { checkDownloadToken, checkToken } from './middleware/jwtChecker'
import cors from 'cors'
import { getDownloadToken } from './controller/download.controller'

const CONFIG = getConfig()
const port = CONFIG.server.port

const app: Express = express()

DB.connect() // await on top level

app.use(cors())

//body parser parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))
//body parser json
app.use(express.json())

/** Scan folders **/
if (CONFIG.server.scanOnStart) {
  for (const f of CONFIG.server.gameFolders) {
    FolderScrapper.ScanFolder(f)
  }
}

app.use('/v1/', collectionsRoutes)
app.use('/v1/', gamesRoutes)
app.use('/v1/', authRoutes)
app.use('/v1/dl/auth', checkToken, getDownloadToken)

for (const f of CONFIG.server.gameFolders) {
  app.use('/v1/dl', checkDownloadToken, express.static(f))
}

app.listen(port)
logger.info('Server listen on : ' + port)
