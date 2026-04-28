import { ApiProperty } from '@nestjs/swagger';
import { AuthSessionUserDto } from '../auth-session/auth-session-user.dto';
import { AuthTokenPair } from '@/common/auth';

export class RegisterResponseDto {
	@ApiProperty({ type: () => AuthSessionUserDto })
	user!: AuthSessionUserDto;

	/** Уходит в Set-Cookie через интерцептор, в JSON клиенту не попадает. */
	tokens!: AuthTokenPair;
}
