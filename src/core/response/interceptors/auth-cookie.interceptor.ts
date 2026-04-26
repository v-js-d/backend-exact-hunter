import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Response } from 'express';
import { AuthCookieService } from '@/common/cookie';

/**
 * После хендлера: читает `data.tokens` (пара access/refresh), выставляет
 * `Set-Cookie` через `AuthCookieService`, затем `delete data.tokens`, чтобы
 * токены не ушли в JSON. Подключается декоратором `@SetAuthCookie()`.
 * Подробно: `documentation/auth-strategy.md`.
 */
@Injectable()
export class AuthCookieInterceptor implements NestInterceptor {
	constructor(private cookieService: AuthCookieService) {}

	intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> {
		const ctx = context.switchToHttp();
		const res = ctx.getResponse<Response>();

		return next.handle().pipe(
			tap((data) => {
				const payload = data as {
					tokens?: { accessToken?: string; refreshToken?: string };
				};

				if (payload.tokens?.accessToken) {
					this.cookieService.setAccessToken(res, payload.tokens.accessToken);
				}

				if (payload.tokens?.refreshToken) {
					this.cookieService.setRefreshToken(res, payload.tokens.refreshToken);
				}

				if (payload.tokens) {
					delete payload.tokens;
				}
			}),
		);
	}
}
