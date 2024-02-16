import { Model, Schema, model } from 'mongoose'
import type { IGameDoc, IGameCard } from '@/types/game.types'

interface GameModel extends Model<IGameDoc> {
  getGame(id: string): Promise<IGameDoc>
  listGames(): Promise<IGameCard[]>
  findGameByFolder(folderName: string): Promise<string>
  gameIdExist(id: string): Promise<boolean>
}

const gameSchema = new Schema<IGameDoc, GameModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    released: {
      type: String,
      required: false,
    },
    score: {
      type: Number,
      required: false,
    },
    background_image: {
      type: String,
      required: false,
    },
    developers: {
      type: [String],
      required: false,
    },
    genres: {
      type: [String],
      required: false,
    },
    screenshots: {
      type: [String],
      required: false,
    },
    size: {
      type: Number,
      required: false,
    },
    gameFolder: {
      type: String,
      required: true,
    },
    gameFiles: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

gameSchema.static('getGame', async function getGame(id: string): Promise<IGameDoc> {
  return (await this.findOne({ id: id })) as IGameDoc
})

gameSchema.static('listGames', async function listGames(): Promise<IGameCard[]> {
  const resp = await this.find()

  return resp as IGameCard[]
})
gameSchema.static('findGameByFolder', async function findGameId(folderName: string): Promise<string> {
  const resp = await this.findOne({ gameFolder: folderName })

  if (resp) return resp.id
  else return ''
})

gameSchema.static('gameIdExist', async function gameIdExist(id: string): Promise<boolean> {
  const b = await Game.exists({ id: id })
  return b ? true : false
})

const Game = model<IGameDoc, GameModel>('Game', gameSchema)

export { Game }
