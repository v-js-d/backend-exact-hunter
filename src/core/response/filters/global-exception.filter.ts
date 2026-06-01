import {
	ArgumentsHost,
	BadRequestException,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
	Injectable,
} from '@nestjs/common';

import { Request, Response } from 'express';
import { IResponseError } from '../interface/response.interface';
import { GlobalExceptionFilterLogger } from './lib/global-exception.log.util';
import { ValidationException } from './validation.exception';

@Catch()
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
	constructor(private readonly logger: GlobalExceptionFilterLogger) {}
	private getStatusCode(exception: unknown): HttpStatus {
		if (exception instanceof HttpException) {
			return exception.getStatus();
		}
		return HttpStatus.INTERNAL_SERVER_ERROR;
	}

	private getErrorResponse(exception: unknown): Error {
		return exception instanceof Error ? exception : new Error(JSON.stringify(exception));
	}

	private handleValidationException(exception: BadRequestException, request: Request, response: Response) {
		const res = exception.getResponse();

		const messageArray: string[] | string =
			typeof res === 'object' && res !== null && 'message' in res
				? (res as { message: string | string[] }).message
				: [];

		this.logger.logValidationError(request, messageArray);

		const responseBody: IResponseError = {
			message: 'Validation failed',
			errors: Array.isArray(messageArray) ? messageArray : [messageArray],
		};
		return response.status(HttpStatus.BAD_REQUEST).json(responseBody);
	}

	private handleGenericException(error: Error, request: Request, response: Response, status: HttpStatus): Response {
		const isChromeProbe =
			status === HttpStatus.NOT_FOUND && request.url === '/.well-known/appspecific/com.chrome.devtools.json';

		if (!isChromeProbe) {
			this.logger.logError(request, error);
		}

		const responseBody: IResponseError = {
			message: error.message,
			errors: [],
		};
		return response.status(status).json(responseBody);
	}

	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const request: Request = ctx.getRequest<Request>();
		const response: Response = ctx.getResponse<Response>();
		const status: HttpStatus = this.getStatusCode(exception);
		const error: Error = this.getErrorResponse(exception);

		// Обработка валидационных ошибок
		if (exception instanceof ValidationException) {
			return this.handleValidationException(exception, request, response);
		}

		// Обработка всех остальных ошибок
		return this.handleGenericException(error, request, response, status);
	}
}
