//Short info of a game mainly use for list display
interface IGameCard {
  id: string
  name: string
  background_image: string
}

//Full description of a game, contains all infos
interface IGameDoc extends IGameCard {
  // id: string
  // name: string
  // background_image: string
  description: string
  released: string
  score: number
  developers: string[]
  genres: string[]
  screenshots: string[]
  size: number
  gameFolder: string
  gameFiles: string[]
}

export type { IGameDoc, IGameCard }
