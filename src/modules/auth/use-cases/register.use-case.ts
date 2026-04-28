import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { Request } from 'express';
import { UserRole } from 'generated/prisma/enums';
import { EnumAuthError } from '../consts/auth.errors';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register/register-request.dto';
import { RegisterResponseDto } from '../dto/register/register-response.dto';
import { BCRYPT_SALT_ROUNDS } from '@/modules/token';
import { UserService } from '@/modules/user';

/**
 * Регистрация пользователя. Пароль хешируется перед сохранением.
 * Подтверждение почты пока не делаем — сразу `isActivated: true`, затем выдача сессии (как при login).
 */
@Injectable()
export class RegisterUseCase {
	constructor(
		private readonly userService: UserService,
		private readonly authService: AuthService,
	) {}

	private assertRegisterableRole(role: UserRole): asserts role is typeof UserRole.CANDIDATE | typeof UserRole.EMPLOYER {
		if (role !== UserRole.CANDIDATE && role !== UserRole.EMPLOYER) {
			throw new UnauthorizedException(EnumAuthError.AUTH_SCOPE_NOT_SUPPORTED);
		}
	}

	async execute(dto: RegisterDto, request: Request): Promise<RegisterResponseDto> {
		this.assertRegisterableRole(dto.role);

		const existing = await this.userService.findByEmail(dto.email);
		if (existing) {
			throw new ConflictException(EnumAuthError.USER_EMAIL_ALREADY_EXISTS);
		}

		const passwordHash = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);

		const created = await this.userService.create({
			email: dto.email,
			password: passwordHash,
			role: dto.role,
		});

		/** Пока без письма: сразу «подтверждённая» учётка. */
		const activated = await this.userService.update(created.id, { isActivated: true });
		const pair = await this.authService.getAuthenticatedToken(request, activated.id, dto.role);
		const user = this.authService.getAuthenticatedUser(activated, dto.role);
		return {
			tokens: pair,
			user: user,
		};
	}
}
