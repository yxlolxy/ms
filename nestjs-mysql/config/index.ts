import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { RedisOptions } from 'ioredis'
import { resolve } from 'path'
import { WinstonAdaptor } from 'typeorm-logger-adaptor/logger/winston'
import { createLogger, format, transports } from 'winston'
import 'winston-daily-rotate-file'

const isDev = process.env.mode !== 'prod'

const logFormatter = [
  format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  isDev && format.colorize(),
  format.printf((info) => {
    const { timestamp, level, stack } = info
    const message = stack || info.message
    return `[${timestamp}]-[${level}]: ${message}`
  }),
].filter(Boolean)

export const logger = createLogger({
  transports: [
    !isDev &&
      new transports.DailyRotateFile({
        level: 'info',
        filename: '%DATE%.log',
        dirname: resolve(process.cwd(), 'logs'),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        format: format.combine(...logFormatter),
      }),
    isDev &&
      new transports.Console({
        level: 'silly',
        format: format.combine(...logFormatter),
      }),
  ].filter(Boolean),
})

const mysql: TypeOrmModuleOptions[] = [
  {
    name: 'ms',
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'sa',
    password: '123456',
    database: 'ms',
    synchronize: true,
    autoLoadEntities: true,
    logger: new WinstonAdaptor(logger, 'all'),
  },
]

const redis: {
  enable: boolean
  host: string
  port: number
  options: RedisOptions
} = {
  enable: false, // false则不启动redis客户端服务，由内存代替
  host: '192.168.2.130',
  port: 6379,
  options: {
    db: 0,
    password: '123456',
    lazyConnect: true,
  },
}

export default {
  isDev,
  host: 'localhost',
  port: 3000,
  cors: true,
  tokenExpires: '1h', // 单位's' 支持字符串 格式：60, "2 days", "10h", "7d"
  apiPrefix: 'api',
  apiNoTokenList: ['test', 'login', 'register', 'getValidateCode'],
  staticPaths: [resolve('../public'), resolve('../upload')],
  mysql,
  logger,
  redis,
}
