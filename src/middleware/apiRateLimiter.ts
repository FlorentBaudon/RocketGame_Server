import rateLimit from 'express-rate-limit'
import { getConfig } from '../tools/ConfigFile'

const CONFIG = getConfig()
const LoginLimiter = rateLimit({
  windowMs: CONFIG.security.time * 60 * 1000, // 15 minutes
  max: CONFIG.security.nbRequest, // 5 requests
  message: 'Too many login, please try again later.',
})

const RequestLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 30, // 30 requests
  message: 'Too many attempts, please try again later.',
})

export { LoginLimiter, RequestLimiter }
