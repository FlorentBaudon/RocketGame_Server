import { Schema, model } from 'mongoose'
import { ISession } from '@/types/session.types'

const sessionSchema = new Schema<ISession>(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    userID: {
      type: String,
      required: true,
    },
    deviceName: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

const Session = model('Session', sessionSchema)

export { Session }
