import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { ExceptionsFilter } from 'src/filters/exceptions.filter'

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionsFilter,
    },
  ],
})
export class ExceptionModule {}
