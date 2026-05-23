import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { EnumAuthError } from '../consts/auth.errors';
import { ResetPasswordDto } from '../dto/password/reset-password.dto';
import { BCRYPT_SALT_ROUNDS, TokenService } from '@/modules/token';
import { UserService } from '@/modules/user';

/**
 * Установка нового пароля по одноразовому токену из письма.
 * Инвалидирует все refresh-сессии пользователя.
 */
@Injectable()
export class ResetPasswordUseCase {
	constructor(
		private readonly userService: UserService,
		private readonly tokenService: TokenService,
	) {}

	async execute(dto: ResetPasswordDto): Promise<void> {
		const user = await this.userService.findByPasswordResetToken(dto.token);

		if (!user) {
			throw new UnauthorizedException(EnumAuthError.PASSWORD_RESET_TOKEN_INVALID);
		}

		if (!user.passwordResetExpires || user.passwordResetExpires < new Date()) {
			throw new UnauthorizedException(EnumAuthError.PASSWORD_RESET_TOKEN_EXPIRED);
		}

		const passwordHash = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);

		await this.userService.update(user.id, {
			password: passwordHash,
			passwordResetToken: null,
			passwordResetExpires: null,
		});

		await this.tokenService.removeAllUserTokens(user.id);
	}
}
