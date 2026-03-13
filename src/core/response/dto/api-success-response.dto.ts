import { ApiProperty } from '@nestjs/swagger';
import { IResponseData } from '../interface/response.interface';

/**
 * Базовый DTO для успешного ответа API
 */
export class ApiSuccessResponseDto<T> implements IResponseData<T> {
	@ApiProperty({
		description: 'Response data',
	})
	result!: T;
}
