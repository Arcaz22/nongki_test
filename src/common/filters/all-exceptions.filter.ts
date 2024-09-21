import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
import { BaseError } from '../responses/error-response';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let errorDetails = null;

        if (exception instanceof HttpException) {
            statusCode = exception.getStatus();
            const exceptionResponse = exception.getResponse() as
                | string
                | { message: string; details: any };
            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            } else {
                message = exceptionResponse.message;
                errorDetails = exceptionResponse.details;
            }
        }

        const baseError = new BaseError(statusCode, message, errorDetails);

        response.status(statusCode).json(baseError);
    }
}
