import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export enum SmokeHealthStatus {
	OK = 'ok',
	ERROR = 'error',
}

export class SmokeHealthResponseDto {
	@ApiProperty({
		description: 'Status',
		example: SmokeHealthStatus.OK,
	})
	@IsNotEmpty()
	@IsEnum(SmokeHealthStatus)
	status!: SmokeHealthStatus;
}
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

export enum SmokeErrorType {
	BAD_REQUEST = 'bad_request',
	UNAUTHORIZED = 'unauthorized',
	FORBIDDEN = 'forbidden',
	NOT_FOUND = 'not_found',
	CONFLICT = 'conflict',
	INTERNAL = 'internal',
}

export class SmokeErrorQueryDto {
	@ApiProperty({
		description: 'Error type to emulate',
		enum: SmokeErrorType,
		example: SmokeErrorType.BAD_REQUEST,
	})
	@IsEnum(SmokeErrorType)
	type!: SmokeErrorType;
}

export class SmokeValidateResponseDto {
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
	@IsInt()
	@Min(0)
	@Max(130)
	age?: number;
}
