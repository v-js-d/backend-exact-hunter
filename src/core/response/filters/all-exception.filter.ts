import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

import { AllExceptionsFilterLogger } from './lib/all-exception.log.util';
import { ValidationException } from './validation.exception';

@Catch()
@Injectable()
export class AllExceptionsFilter implements ExceptionFilter {
	constructor(private readonly logger: AllExceptionsFilterLogger) {}

	private handleHttpException(exception: HttpException, request: Request, response: Response) {
		const exceptionResponse = exception.getResponse() as {
			message: string;
			error: string;
			statusCode: number;
		};

		this.logger.logError(request, exception);

		return response.status(exceptionResponse.statusCode).json({ ...exceptionResponse });
	}

	private handleValidationException(exception: ValidationException, request: Request, response: Response) {
		const exceptionResponse = exception.getResponse() as {
			message: string;
			errors: unknown;
			statusCode: number;
		};

		this.logger.logValidationError(request, exceptionResponse.errors);

		return response.status(400).json({ ...exceptionResponse });
	}

	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const request = ctx.getRequest<Request>();
		const response = ctx.getResponse<Response>();

		// ошибки валидации
		if (exception instanceof ValidationException) {
			return this.handleValidationException(exception, request, response);
		}

		// ошибки http
		if (exception instanceof HttpException) {
			return this.handleHttpException(exception, request, response);
		}

		// остальные ошибки
		response
			.status(HttpStatus.INTERNAL_SERVER_ERROR)
			.json({ message: 'Internal server error', statusCode: HttpStatus.INTERNAL_SERVER_ERROR });
	}
}
