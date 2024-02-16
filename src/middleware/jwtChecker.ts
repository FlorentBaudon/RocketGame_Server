import { NextFunction, Request, Response } from 'express'
import * as loginTool from '../services/authTools'

export async function checkToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token: string = req.headers.authorization?.split(' ')[1] as string
    const user = await loginTool.checkUserToken(token)
    req.body.user = user

    if (!user || !user.isEnabled) {
      throw 'Unauthorize'
    }

    next()
  } catch (error) {
    res.status(401).send(error)
  }
}

export async function checkDownloadToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token: string = req.query.token as string
    const user = await loginTool.checkUserToken(token)
    req.body.user = user

    if (!user) {
      throw 'Unauthorize'
    }

    next()
  } catch (error) {
    res.status(401).send(error)
  }
}
