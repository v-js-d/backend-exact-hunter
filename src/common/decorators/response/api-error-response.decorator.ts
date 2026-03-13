import { applyDecorators } from '@nestjs/common';
import { ApiErrorResponseDto } from '@core/response';
import { ERROR_DECORATORS, ERROR_DESCRIPTIONS, ERROR_EXAMPLES } from './consts/api-error-response.consts';

/**
 * Decorator for documenting error responses in Swagger
 * Accepts an array of HTTP status codes and generates appropriate Swagger decorators
 *
 * @example
 * @ApiErrorResponse([400, 401])
 * @ApiErrorResponse([404])
 * @ApiErrorResponse([400, 409])
 */
export const ApiErrorResponse = (statusCodes: number[]) => {
	const isDecorator = (
		decorator: (ClassDecorator & MethodDecorator) | null,
	): decorator is ClassDecorator & MethodDecorator => decorator !== null;

	const decorators = statusCodes
		.map((code) => {
			const decoratorFn = ERROR_DECORATORS[code];
			if (!decoratorFn) {
				return null;
			}
			return decoratorFn({
				description: ERROR_DESCRIPTIONS[code] || `Error ${code}`,
				type: ApiErrorResponseDto,
				example: ERROR_EXAMPLES[code],
			});
		})
		.filter(isDecorator);

	return applyDecorators(...decorators);
};
