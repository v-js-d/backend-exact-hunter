import { randomUUID } from 'crypto';
import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { Request } from 'express';
import { EnumIdentifierType, UserRole } from 'generated/prisma/enums';
import { EnumAuthError } from '../consts/auth.errors';
import { AuthService } from '../services/auth.service';
import { AuthResponseDto } from '../dto/auth-session/auth.response.dto';
import { IdentifyDto } from '../dto/identify/identify.dto';
import { BCRYPT_SALT_ROUNDS } from '@/modules/token';
import { UserService } from '@/modules/user';
import { MailService } from '@/modules/mail';
import { EnumEmailTextByRoleType } from '@/modules/mail/templates/type/text.type';

/**
 * Регистрация пользователя. Пароль хешируется перед сохранением.
 * Подтверждение почты пока не делаем — сразу `isActivated: true`, затем выдача сессии (как при login).
 */
@Injectable()
export class RegisterUseCase {
	constructor(
		private readonly userService: UserService,
		private readonly authService: AuthService,
		private readonly mailService: MailService,
	) {}

	private assertRegisterableRole(role: UserRole): asserts role is typeof UserRole.CANDIDATE | typeof UserRole.EMPLOYER {
		if (role !== UserRole.CANDIDATE && role !== UserRole.EMPLOYER) {
			throw new UnauthorizedException(EnumAuthError.AUTH_SCOPE_NOT_SUPPORTED);
		}
	}

	private throwRegisterError(type: EnumIdentifierType | undefined): string {
		if (type === EnumIdentifierType.EMAIL) {
			throw new ConflictException(EnumAuthError.USER_EMAIL_ALREADY_EXISTS);
		}
		if (type === EnumIdentifierType.PHONE) {
			throw new ConflictException(EnumAuthError.USER_PHONE_ALREADY_EXISTS);
		}
		throw new BadRequestException(EnumAuthError.INVALID_IDENTIFIER);
	}

	private generateActivationLink(): string {
		const activationLink = randomUUID();
		return activationLink;
	}

	async execute(dto: IdentifyDto, request: Request): Promise<AuthResponseDto> {
		this.assertRegisterableRole(dto.role);
		if (!dto.identifier && !dto.type) {
			this.throwRegisterError(dto.type);
		}
		const existing = await this.userService.findByIdentifier(dto.identifier, dto.type);

		if (existing) {
			this.throwRegisterError(dto.type);
		}

		const passwordHash = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);
		const activationLink = this.generateActivationLink();
		const created = await this.userService.create({
			email: dto.type === EnumIdentifierType.EMAIL ? dto.identifier : undefined,
			phone: dto.type === EnumIdentifierType.PHONE ? dto.identifier : undefined,
			identifierType: dto.type,
			password: passwordHash,
			role: dto.role,
			activationLink,
		});

		if (dto.type === EnumIdentifierType.EMAIL && created.email) {
			const emailRole =
				dto.role === UserRole.EMPLOYER ? EnumEmailTextByRoleType.EMPLOYER : EnumEmailTextByRoleType.CANDIDATE;
			await this.mailService.sendActivationLink({
				email: created.email,
				name: created.email.split('@')[0] ?? created.email,
				activationToken: activationLink,
				role: emailRole,
			});
		} else {
			/** Пока без подтверждения по телефону: сразу «подтверждённая» учётка. */
			await this.userService.update(created.id, { isActivated: true });
		}

		const pair = await this.authService.getAuthenticatedToken(request, created.id, dto.role);
		const user = this.authService.getAuthenticatedUser(created, dto.role);
		return {
			tokens: pair,
			user: user,
		};
	}
}
