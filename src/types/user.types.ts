interface IUser {
  email: string
  password: string
  name: string
  loginCount: number
  isAdmin: boolean
  sessionToken: string[]
  isEnabled: boolean
  canDownload: boolean
}

export type { IUser }
