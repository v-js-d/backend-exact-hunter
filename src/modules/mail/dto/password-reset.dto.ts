import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class SendMailPasswordResetDto {
	@ApiProperty({
		description: 'Email получателя',
		example: 'user@example.com',
	})
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email!: string;

	@ApiProperty({
		description: 'Имя пользователя (для приветствия в письме)',
		example: 'Alice',
	})
	@IsString()
	@IsNotEmpty()
	name!: string;

	@ApiProperty({
		description: 'Reset Token для сброса пароля',
		example: '1234567890',
	})
	@IsString()
	@IsNotEmpty()
	resetToken!: string;

	@ApiProperty({
		description: 'Сколько минут живёт ссылка — подставляется в текст письма',
		example: 30,
		minimum: 1,
	})
	@IsInt()
	@Min(1)
	expiresInMinutes!: number;
}
