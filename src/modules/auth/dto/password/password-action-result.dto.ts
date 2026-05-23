import { ApiProperty } from '@nestjs/swagger';

export class PasswordActionResultDto {
	@ApiProperty({ example: true, description: 'Операция принята к обработке' })
	success!: boolean;
}
