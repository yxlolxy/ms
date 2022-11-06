import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import config from 'config'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import { concat, from, Observable, throwError } from 'rxjs'
import { cache } from 'src/utils/cache.util'
import { getRedisClient, isTokenApi } from 'src/utils/http.util'

/**
 * token 校验拦截器
 */
@Injectable()
export class AuthInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuthInterceptor.name)
  constructor(private readonly jwtService: JwtService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest()
    const token = req.header('Authorization')
    try {
      if (isTokenApi(req.url)) {
        // 开启redis，通过redis判断是否登出
        if (config.redis.enable) {
          this.jwtService.verify(token)
          const redisClient = getRedisClient()
          return concat(
            from(
              redisClient.hexists('loginTokenList', token).then((result) => {
                if (result === 0) {
                  throw new UnauthorizedException()
                }
              }),
            ),
            next.handle().pipe(),
          )
        } else {
          this.jwtService.verify(token)
          // 关闭redis, 通过内存判断是否登出
          if (!cache.loginTokenList.includes(token)) {
            return throwError(() => new UnauthorizedException())
          }
        }
      }
      return next.handle().pipe()
    } catch (err) {
      this.logger.error(err)
      if (
        err instanceof TokenExpiredError ||
        err instanceof JsonWebTokenError
      ) {
        // token 无效处理
        return throwError(() => new UnauthorizedException())
      } else {
        return throwError(() => err)
      }
    }
  }
}
