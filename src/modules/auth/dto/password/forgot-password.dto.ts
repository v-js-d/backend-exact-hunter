import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
	@ApiProperty({
		description: 'Email учётной записи',
		example: 'user@example.com',
	})
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email!: string;
}
