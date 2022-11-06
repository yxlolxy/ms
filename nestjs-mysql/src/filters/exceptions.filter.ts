import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(ExceptionsFilter.name)
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR
    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus()
    } else if (exception?.status) {
      httpStatus = exception.status
    }

    const responseBody = `${exception}`

    this.logger.error(
      `${httpAdapter.getRequestUrl(ctx.getRequest())} ${exception}`,
    )

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus)
  }
}
