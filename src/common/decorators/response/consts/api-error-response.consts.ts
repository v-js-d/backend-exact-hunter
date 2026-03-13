import { HttpStatus } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiConflictResponse,
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiResponseOptions,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';

/**
 * HTTP status code descriptions mapping
 */
export const ERROR_DESCRIPTIONS: Record<number, string> = {
	[HttpStatus.BAD_REQUEST]: 'Bad Request',
	[HttpStatus.UNAUTHORIZED]: 'Unauthorized',
	[HttpStatus.FORBIDDEN]: 'Forbidden',
	[HttpStatus.NOT_FOUND]: 'Not Found',
	[HttpStatus.CONFLICT]: 'Conflict',
	[HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
};

type ErrorBodyExample = {
	message: string;
	errors?: string[];
};

export const ERROR_EXAMPLES: Partial<Record<number, ErrorBodyExample>> = {
	[HttpStatus.BAD_REQUEST]: {
		message: 'Validation failed',
		errors: ['email must be an email', 'password must be longer than 8 characters'],
	},
	[HttpStatus.UNAUTHORIZED]: {
		message: 'Unauthorized',
	},
	[HttpStatus.FORBIDDEN]: {
		message: 'Forbidden',
	},
	[HttpStatus.NOT_FOUND]: {
		message: 'Resource not found',
	},
	[HttpStatus.CONFLICT]: {
		message: 'Conflict',
	},
	[HttpStatus.INTERNAL_SERVER_ERROR]: {
		message: 'Internal server error',
	},
};

/**
 * HTTP status code to Swagger decorator mapping
 */
type ErrorDecorator = (options: ApiResponseOptions) => ClassDecorator & MethodDecorator;

export const ERROR_DECORATORS: Record<number, ErrorDecorator> = {
	[HttpStatus.BAD_REQUEST]: (opts) => ApiBadRequestResponse(opts),
	[HttpStatus.UNAUTHORIZED]: (opts) => ApiUnauthorizedResponse(opts),
	[HttpStatus.FORBIDDEN]: (opts) => ApiForbiddenResponse(opts),
	[HttpStatus.NOT_FOUND]: (opts) => ApiNotFoundResponse(opts),
	[HttpStatus.CONFLICT]: (opts) => ApiConflictResponse(opts),
	[HttpStatus.INTERNAL_SERVER_ERROR]: (opts) => ApiInternalServerErrorResponse(opts),
};
