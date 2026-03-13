import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IResponseError } from '../interface/response.interface';

export class ApiErrorResponseDto implements IResponseError {
	@ApiProperty({
		example: 'Validation failed',
		description: 'Error message',
		type: String,
	})
	message!: string;

	@ApiPropertyOptional({
		example: ['email must be an email', 'password must be longer than 8 characters'],
		description: 'Array of validation errors (for validation errors)',
		type: [String],
	})
	errors?: string[];
}
