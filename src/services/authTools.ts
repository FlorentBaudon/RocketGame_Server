import jwt, { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { getConfig } from '../tools/ConfigFile'
import { User } from '../model/mongodb/user.model'
import { IUser } from '@/types/user.types'

const CONFIG = getConfig()

export async function checkPassword(password: string, encryptedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, encryptedPassword)
}

export function createAuthToken(id: any): string {
  const token = jwt.sign({ _id: id }, CONFIG.server.JWT_SECRET, { expiresIn: CONFIG.user.ttlToken })
  return token
}

export function createDownloadToken(id: any): string {
  const token = jwt.sign({ _id: id }, CONFIG.server.JWT_SECRET, { expiresIn: 10 })
  return token
}

export async function checkUserToken(token: string): Promise<IUser> {
  try {
    const decoded: JwtPayload = jwt.verify(token, CONFIG.server.JWT_SECRET) as JwtPayload
    return (await User.findOne({ _id: decoded._id })) as IUser
  } catch (err: any) {
    throw `Error verifying token: ${err.message}`
  }
}
