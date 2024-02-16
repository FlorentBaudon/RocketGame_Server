import { IUser } from '@/types/user.types'
import { Request, Response } from 'express'
import { User } from '../model/mongodb/user.model'
import logger from '../middleware/winston'
import * as loginTool from '../services/authTools'

export async function signin(req: Request, res: Response) {
  try {
    const userAttempt: IUser = req.body as IUser
    const user = await User.findOne({ email: userAttempt.email })

    if (!user) {
      return res.status(401).send('Invalid username or password')
    }
    const match: boolean = await loginTool.checkPassword(req.body.password, user?.password as string)

    if (!match || !user.isEnabled) {
      return res.status(401).send('Invalid username or password')
    }

    const token: string = loginTool.createAuthToken(user?._id)
    res.status(200).send(token)
  } catch (error) {
    logger.error(error)
    res.status(500).send('Internal Error')
  }
}

export async function signup(req: Request, res: Response) {
  try {
    const user = new User(req.body as IUser)
    await user.save()

    res.status(200).send('User created')
  } catch (error) {
    logger.error(error)
    res.status(500).send('Internal Error')
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    await User.findOneAndUpdate({ email: req.body.email }, { name: req.body.name, password: req.body.password })
    res.status(200).send('User updated')
  } catch (error) {
    logger.error(error)
    res.status(500).send('Internal Error')
  }
}

export async function checkUser(req: Request, res: Response) {
  try {
    const user: IUser = req.body.user

    if (!user.isEnabled) {
      res.status(401).send('Unauthorized')
    }

    const responseObject = {
      email: user.email,
      name: user.name,
      loginCount: user.loginCount,
      isAdmin: user.isAdmin,
      isEnabled: user.isEnabled,
      canDownload: user.canDownload,
    }

    res.status(200).send(responseObject)
  } catch (error) {
    logger.error(error)
    res.status(500).send('Internal Error')
  }
}
