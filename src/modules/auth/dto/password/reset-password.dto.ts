import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsPassword } from '@/common';

export class ResetPasswordDto {
	@ApiProperty({
		description: 'Одноразовый токен из ссылки в письме',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	@IsString()
	@IsNotEmpty()
	token!: string;

	@ApiProperty({
		description: 'Новый пароль',
		example: 'SecurePass123!',
	})
	@IsPassword()
	@IsString()
	@IsNotEmpty()
	password!: string;
}
