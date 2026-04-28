import { ApiProperty } from '@nestjs/swagger';
import { MeUserDto } from './me-user.dto';

export class MeResponseDto {
	@ApiProperty({ type: () => MeUserDto })
	user!: MeUserDto;
}
