import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class SmokeValidateRequestDto {
	@ApiProperty({
		description: 'Name',
		example: 'Vadim',
	})
	@IsString()
	@IsNotEmpty()
	name!: string;

	@ApiProperty({
		description: 'Age',
		example: 29,
		required: false,
	})
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	@Max(130)
	age?: number;
}
