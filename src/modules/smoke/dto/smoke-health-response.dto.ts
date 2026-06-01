import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

import { SmokeHealthStatusEnum } from '../enums/smoke-health-status.enum';

export class SmokeHealthResponseDto {
	@ApiProperty({
		description: 'Status',
		example: SmokeHealthStatusEnum.OK,
	})
	@IsNotEmpty()
	@IsEnum(SmokeHealthStatusEnum)
	status!: SmokeHealthStatusEnum;
}
