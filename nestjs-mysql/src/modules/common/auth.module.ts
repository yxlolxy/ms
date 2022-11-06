import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import config from 'config'
import { AuthInterceptor } from 'src/interceptors/auth.interceptor'
import { getTokenSecret } from 'src/utils/http.util'

@Module({
  imports: [
    JwtModule.register({
      secret: getTokenSecret(),
      signOptions: { expiresIn: config.tokenExpires },
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthInterceptor,
    },
  ],
  exports: [JwtModule],
})
export class AuthModule {}
