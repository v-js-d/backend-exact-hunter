import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { Request } from 'express';
import { UserRole } from 'generated/prisma/enums';
import { EnumAuthError } from '../consts/auth.errors';
import { AuthSessionRequestDto } from '../dto/auth-session/auth-session.request.dto';
import { RegisterDto } from '../dto/register/register-request.dto';
import { RegisterResponseDto } from '../dto/register/register-response.dto';
import { AuthContextService } from '../services/auth-context.service';
import { AuthRequestMetaService } from '../services/auth-request-meta.service';
import { BCRYPT_SALT_ROUNDS, TokenService } from '@/modules/token';
import { RoleContextService } from '@/modules/role-context';
import { UserService } from '@/modules/user';

/**
 * Регистрация пользователя. Пароль хешируется перед сохранением.
 * Подтверждение почты пока не делаем — сразу `isActivated: true`, затем выдача сессии (как при login).
 */
@Injectable()
export class RegisterUseCase {
	constructor(
		private readonly userService: UserService,
		private readonly roleContextService: RoleContextService,
		private readonly authContextService: AuthContextService,
		private readonly authRequestMetaService: AuthRequestMetaService,
		private readonly tokenService: TokenService,
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

		const roleContext = await this.roleContextService.findFirstForUserWithHrRole(activated.id, dto.role);
		if (!roleContext) {
			throw new UnauthorizedException(EnumAuthError.ROLE_NOT_FOUND);
		}

		const buildData: AuthSessionRequestDto = {
			roleContextId: roleContext.id,
			userId: activated.id,
			userRole: roleContext.userRole,
		};
		const payload = await this.authContextService.buildAccessPayload(buildData);
		const requestMeta = this.authRequestMetaService.fromRequest(request);
		const pair = await this.tokenService.generateTokenPair(payload, requestMeta);

		return {
			tokens: pair,
			user: {
				id: activated.id,
				email: activated.email,
				role: roleContext.userRole,
				isActivated: activated.isActivated,
			},
		};
	}
}
