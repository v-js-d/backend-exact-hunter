import { randomBytes } from 'crypto';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { BCRYPT_SALT_ROUNDS, EnumTokenError, REFRESH_TOKEN_BYTES } from '../consts/token.consts';
import { TokenRepository } from '../repositories/token.repository';
import { AuthTokenPair, IAccessTokenPayload, IRequestMeta } from '../types/token.type';
import { getTtlFromConfig } from '../utils/get-token-configs.utils';

@Injectable()
export class TokenService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly tokenRepository: TokenRepository,
	) {}

	/** Только полезная нагрузка access JWT — без `exp`/`iat`/пр., чтобы `sign` не конфликтовал с `expiresIn` из модуля. */
	private pickSignPayload(payload: IAccessTokenPayload): IAccessTokenPayload {
		return {
			sub: payload.sub,
			roleContextId: payload.roleContextId,
			userRole: payload.userRole,
			companyId: payload.companyId ?? null,
			hrRoleName: payload.hrRoleName ?? null,
		};
	}

	private calculateRefreshExpiry(): Date {
		return new Date(Date.now() + getTtlFromConfig(this.configService));
	}

	generateAccessToken(payload: IAccessTokenPayload): string {
		return this.jwtService.sign(this.pickSignPayload(payload));
	}

	generateRefreshToken(): string {
		return randomBytes(REFRESH_TOKEN_BYTES).toString('hex');
	}

	async hashRefreshToken(plain: string): Promise<string> {
		return bcrypt.hash(plain, BCRYPT_SALT_ROUNDS);
	}

	async compareRefreshToken(plain: string, hash: string): Promise<boolean> {
		return bcrypt.compare(plain, hash);
	}

	async saveToken(userId: string, roleContextId: string, refreshToken: string, meta: IRequestMeta): Promise<void> {
		const refreshTokenHash = await this.hashRefreshToken(refreshToken);
		const expiresAt = this.calculateRefreshExpiry();

		await this.tokenRepository.save({
			userId,
			roleContextId,
			refreshTokenHash,
			expiresAt,
			deviceId: meta.deviceId,
			deviceName: meta.deviceName,
			userAgent: meta.userAgent,
			ipAddress: meta.ipAddress,
		});
	}

	async generateTokenPair(payload: IAccessTokenPayload, meta: IRequestMeta): Promise<AuthTokenPair> {
		const accessToken = this.generateAccessToken(payload);
		const refreshToken = this.generateRefreshToken();

		await this.saveToken(payload.sub, payload.roleContextId, refreshToken, meta);

		return { accessToken, refreshToken };
	}

	async validateAccessToken(accessToken: string): Promise<IAccessTokenPayload> {
		try {
			const decoded = await this.jwtService.verifyAsync<IAccessTokenPayload>(accessToken);
			return this.pickSignPayload(decoded);
		} catch (error) {
			if (error instanceof TokenExpiredError) {
				throw new UnauthorizedException(EnumTokenError.ACCESS_TOKEN_EXPIRED);
			}
			if (error instanceof JsonWebTokenError) {
				throw new UnauthorizedException(EnumTokenError.ACCESS_TOKEN_INVALID);
			}
			throw new UnauthorizedException(EnumTokenError.ACCESS_TOKEN_INVALID);
		}
	}

	/**
	 * Декодирует access JWT и проверяет подпись, но игнорирует exp.
	 * Нужен для `POST /auth/refresh`: по просроченному access узнаём `sub` и `roleContextId` до проверки refresh в БД.
	 */
	async decodeAccessTokenIgnoringExpiration(accessToken: string): Promise<IAccessTokenPayload> {
		try {
			const decoded = await this.jwtService.verifyAsync<IAccessTokenPayload>(accessToken, {
				ignoreExpiration: true,
			});
			return this.pickSignPayload(decoded);
		} catch {
			throw new UnauthorizedException(EnumTokenError.ACCESS_TOKEN_INVALID);
		}
	}

	async validateRefreshToken(
		refreshToken: string,
		userId: string,
		roleContextId: string,
		deviceId: string,
	): Promise<void> {
		const tokenRecord = await this.tokenRepository.findByUserAndDevice(userId, roleContextId, deviceId);

		if (!tokenRecord) {
			throw new UnauthorizedException(EnumTokenError.REFRESH_TOKEN_NOT_FOUND);
		}

		if (tokenRecord.expiresAt < new Date()) {
			await this.tokenRepository.deleteById(tokenRecord.id);
			throw new UnauthorizedException(EnumTokenError.REFRESH_TOKEN_EXPIRED);
		}

		const isValid = await this.compareRefreshToken(refreshToken, tokenRecord.refreshToken);
		if (!isValid) {
			await this.tokenRepository.deleteById(tokenRecord.id);
			throw new UnauthorizedException(EnumTokenError.REFRESH_TOKEN_INVALID);
		}
	}

	async rotateRefreshToken(payload: IAccessTokenPayload, meta: IRequestMeta): Promise<AuthTokenPair> {
		const existing = await this.tokenRepository.findByUserAndDevice(payload.sub, payload.roleContextId, meta.deviceId);

		if (existing) {
			await this.tokenRepository.deleteById(existing.id);
		}

		return this.generateTokenPair(payload, meta);
	}

	async removeToken(userId: string, roleContextId: string, deviceId: string): Promise<void> {
		const tokenRecord = await this.tokenRepository.findByUserAndDevice(userId, roleContextId, deviceId);
		if (tokenRecord) {
			await this.tokenRepository.deleteById(tokenRecord.id);
		}
	}

	async removeAllUserTokens(userId: string): Promise<number> {
		return this.tokenRepository.deleteAllByUserId(userId);
	}
}
