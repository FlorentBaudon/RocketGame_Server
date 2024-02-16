import { createLogger, format, transports } from 'winston'
const { combine, timestamp, printf } = format

const myFormat = printf(info => {
  return `${info.timestamp} ${info.level}: ${JSON.stringify(info.message)}`
})

const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), myFormat),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new transports.Console(),
    new transports.File({ filename: './logs/error.log', level: 'error' }),
    new transports.File({ filename: './logs/combined.log', level: 'info' }),
  ],
})

export default logger
