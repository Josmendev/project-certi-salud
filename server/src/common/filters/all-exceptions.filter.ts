import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = ['Unexpected error'];
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      status = exception.getStatus();
      message = Array.isArray((res as any)?.message)
        ? (res as any).message
        : [(res as any).message || ''];
      error = (res as any)?.error || exception.name;
    }

    const { errno, sqlMessage } = exception as any;
    if (errno === 1062) {
      // Error de duplicado de entrada (clave única)
      status = HttpStatus.BAD_REQUEST;
      const match = sqlMessage.match(/Duplicate entry '(.+?)'/);
      const duplicateValue = match ? match[1] : 'valor duplicado';
      // Mensaje de error para duplicado de clave
      message = [
        `El valor ingresado '${duplicateValue}' ya se encuentra registrado`,
      ];
      error = 'Duplicate Record';
    }

    console.log(exception);

    this.logger.error(`HTTP ${status} Error: ${JSON.stringify(message)}`);

    response.status(status).json({
      message,
      error,
      statusCode: status,
    });
  }
}
