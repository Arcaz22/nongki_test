import { HttpStatus } from '@nestjs/common';

export class BaseError {
    statusCode: HttpStatus;
    message: string;
    errorDetails?: any;

    constructor(statusCode: HttpStatus, message: string, errorDetails?: any) {
        this.statusCode = statusCode;
        this.message = message;
        this.errorDetails = errorDetails;
    }
}
