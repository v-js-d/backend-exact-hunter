import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { SmokeErrorTypeEnum } from '../enums/smoke-error-type.enum';

export class SmokeErrorQueryDto {
	@ApiProperty({
		description: 'Error type to emulate',
		enum: SmokeErrorTypeEnum,
		example: SmokeErrorTypeEnum.BAD_REQUEST,
	})
	@IsEnum(SmokeErrorTypeEnum)
	type!: SmokeErrorTypeEnum;
}
