import { applyDecorators, UseInterceptors } from '@nestjs/common';

import { AuthCookieInterceptor } from '@/core/response/';

/**
 * Вешает `AuthCookieInterceptor` на хендлер. Хендлер должен вернуть объект с
 * `tokens: { accessToken, refreshToken }` — интерцептор пишет HttpOnly куки и
 * удаляет `tokens` из тела. См. `documentation/auth-strategy.md`.
 */
export function SetAuthCookie() {
	return applyDecorators(UseInterceptors(AuthCookieInterceptor));
}
