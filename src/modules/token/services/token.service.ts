import { randomBytes } from 'crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import ms, { StringValue } from 'ms';
import { AccessTokenPayload, RequestMeta, TokenPair } from '../types/token.type';
import { TokenRepository } from '../repositories/token.repository';
import { BCRYPT_SALT_ROUNDS, EnumTokenConfig, EnumTokenError, REFRESH_TOKEN_BYTES } from '../consts/token.consts';

@Injectable()
export class TokenService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly tokenRepository: TokenRepository,
	) {}

	private calculateRefreshExpiry(): Date {
		const ttl = this.configService.getOrThrow<string>(EnumTokenConfig.REFRESH_TOKEN_EXPIRES_IN);
		return new Date(Date.now() + ms(ttl as StringValue));
	}

	generateAccessToken(payload: AccessTokenPayload): string {
		const secret = this.configService.getOrThrow<string>(EnumTokenConfig.JWT_SECRET);
		const expiresIn = this.configService.getOrThrow<string>(EnumTokenConfig.JWT_ACCESS_EXPIRES_IN);

		return this.jwtService.sign(
			{ ...payload },
			{ secret, expiresIn: expiresIn as `${number}${'s' | 'm' | 'h' | 'd'}` },
		);
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

	async saveToken(userId: string, roleContextId: string, refreshTokenPlain: string, meta: RequestMeta): Promise<void> {
		const refreshTokenHash = await this.hashRefreshToken(refreshTokenPlain);
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

	async generateTokenPair(payload: AccessTokenPayload, meta: RequestMeta): Promise<TokenPair> {
		const accessToken = this.generateAccessToken(payload);
		const refreshTokenPlain = this.generateRefreshToken();

		await this.saveToken(payload.sub, payload.roleContextId, refreshTokenPlain, meta);

		return { accessToken, refreshTokenPlain };
	}

	async validateAccessToken(accessToken: string): Promise<AccessTokenPayload> {
		try {
			return await this.jwtService.verifyAsync<AccessTokenPayload>(accessToken, {
				secret: this.configService.getOrThrow<string>(EnumTokenConfig.JWT_SECRET),
			});
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

	async validateRefreshToken(
		refreshTokenPlain: string,
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

		const isValid = await this.compareRefreshToken(refreshTokenPlain, tokenRecord.refreshToken);
		if (!isValid) {
			await this.tokenRepository.deleteById(tokenRecord.id);
			throw new UnauthorizedException(EnumTokenError.REFRESH_TOKEN_INVALID);
		}
	}

	async rotateRefreshToken(payload: AccessTokenPayload, meta: RequestMeta): Promise<TokenPair> {
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
