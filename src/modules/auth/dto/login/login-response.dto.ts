import { ApiProperty } from '@nestjs/swagger';
import { AuthSessionUserDto } from '../auth-session/auth-session-user.dto';
import { AuthTokenPair } from '@/common/auth';

export class LoginResponseDto {
	@ApiProperty({ type: () => AuthSessionUserDto })
	user!: AuthSessionUserDto;

	/**
	 * Токены не попадают во фронт в JSON — их отрезает интерцептор, куки ставятся отдельно.
	 */
	tokens!: AuthTokenPair;
}
