import logger from '../middleware/winston'
import mongoose from 'mongoose'
import { getConfig } from '../tools/ConfigFile'

const CONFIG = getConfig()
// const server: string = `mongodb://${CONFIG.dbUser}:${CONFIG.dbPassword}@${CONFIG.mongoDB}/rocketgame?authSource=admin`
const server: string = `mongodb://${CONFIG.mongodb.mongoURL}/rocketgame`

export async function connect() {
  try {
    await mongoose.connect(server)
    logger.info('Connected to mongodb')
  } catch (err) {
    logger.error(err)
  }
}
