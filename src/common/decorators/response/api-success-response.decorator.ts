import { Type } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

/**
 * Декоратор для документирования успешного ответа API
 * Документирует только тип данных, ResponseInterceptor автоматически обернет в { result: T }
 */
export const ApiSuccessResponse = (
	model: Type<unknown>,
	options?: {
		status?: 200 | 201;
		description?: string;
	},
) => {
	const status = options?.status || 200;
	const description = options?.description || 'Success';

	if (status === 201) {
		return ApiCreatedResponse({
			description,
			type: model,
		});
	}

	return ApiOkResponse({
		description,
		type: model,
	});
};
