import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app.module'
import config from '../config'
import Redis from 'ioredis'
import { setRedisClient } from './utils/http.util'

const { logger, cors } = config

async function bootstrap() {
  const { host, port, redis } = config
  const app = await NestFactory.create(AppModule, {
    cors,
    logger,
  })
  app.setGlobalPrefix(config.apiPrefix) // 请求均以api开头
  await app.listen(port, host)
  console.log(`Application is running on: ${await app.getUrl()}`)
  if (config.redis.enable) {
    const redisClient = new Redis(redis.port, redis.host, redis.options)
    redisClient.connect(() => {
      setRedisClient(redisClient)
      console.log(`Redis client connected!`)
    })
  }
}
bootstrap()
