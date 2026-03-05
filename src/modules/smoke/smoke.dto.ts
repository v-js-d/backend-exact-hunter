import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SmokeValidateRequestDto {
	@ApiProperty({
		description: 'Email',
		example: 'test@test.com',
	})
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email!: string;
}

export class SmokeValidateResponseDto {
	@ApiProperty({
		description: 'Email',
		example: 'test@test.com',
	})
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email!: string;
}
