import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
  DomainException,
  InsufficientCreditsException,
  UserNotFoundException,
  UserAlreadyExistsException,
  UnauthorizedException,
} from '@domain/exceptions/domain.exceptions';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.BAD_REQUEST;

    if (exception instanceof UnauthorizedException) {
      status = HttpStatus.UNAUTHORIZED;
    } else if (exception instanceof UserNotFoundException) {
      status = HttpStatus.NOT_FOUND;
    } else if (exception instanceof UserAlreadyExistsException) {
      status = HttpStatus.CONFLICT;
    } else if (exception instanceof InsufficientCreditsException) {
      status = HttpStatus.PAYMENT_REQUIRED;
    }

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: exception.name,
    });
  }
}
