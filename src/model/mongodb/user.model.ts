import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'
import validator from 'validator'
import { IUser } from '@/types/user.types'

import { getConfig } from '../../tools/ConfigFile'
const CONFIG = getConfig()

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: true,
      minlength: [
        CONFIG.security.password.minLength,
        `Password must be at least ${CONFIG.security.password.minLength} characters long`,
      ],
      maxlength: [
        CONFIG.security.password.maxLength,
        `Password must be less than ${CONFIG.security.password.maxLength} characters long`,
      ],
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    loginCount: {
      type: Number,
      default: 0,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    sessionToken: {
      type: [String],
    },
    isEnabled: {
      type: Boolean,
      default: false,
    },
    canDownload: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)
// Hashing password with bscrypt before inserting in DB
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.pre('findOneAndUpdate', async function () {
  const update: any = this.getUpdate()
  const salt = await bcrypt.genSalt(10)
  const password = await bcrypt.hash(update.password, salt)
  this.set({ password: password })
})

const User = model('User', userSchema)

export { User }
