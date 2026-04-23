# Cookie Layer

## Важно: обновление контракта

- В этой ветке тип пары токенов выровнен и реэкспортируется из token-модуля:
  - `export type { AuthTokenPair } from '@/common/auth';`
- `TokenModule` пока в PR. Если при merge появятся конфликты по названию полей пары токенов, в этой ветке актуальный вариант: `accessToken` + `refreshToken`.

## Цель

Сконцентрировать настройки cookies в одном месте и обеспечить единообразную очистку, чтобы клиент не зависал с протухшей/невалидной refresh-сессией.

## Что реализовано

- Роль `CookieService` выполняют `AuthCookieService` и `ConfigCookieService` в `src/common/cookie`.
- Есть единая точка, где задаются:
  - имена cookies
  - режимы `sameSite` и `secure`
  - `domain` и `path`
  - `maxAge` для access/refresh на базе TTL из token-конфига
- Обязательный контракт очистки реализован в `AuthController`:
  - `POST /auth/refresh` при `401` обязательно вызывает `clearAuthCookies(...)`
  - `POST /auth/logout` всегда очищает обе cookies (и при успехе, и при невалидной сессии)

## Соответствие API (текущее)

Нужный API покрыт следующими методами:

- Эквивалент `setAccessToken(...)` + `setRefreshToken(...)`:
  - `AuthCookieService.setAuthCookies(response, scope, payload)`
- Эквивалент `getRefreshToken(req)`:
  - `AuthCookieService.getRefreshTokenFromRequestCookies(req.cookies, scope)`
- `clearAuthCookies(res)`:
  - `AuthCookieService.clearAuthCookies(response, scope)`

`getAccessToken(req)` пока не используется в текущем потоке и может быть добавлен, когда появится сценарий чтения access-cookie из запроса.

## Поведение cookies

- Для access и refresh выставляется `httpOnly: true`
- `secure`:
  - принудительно через `AUTH_COOKIE_SECURE=true|false`
  - иначе fallback: `NODE_ENV === production` -> `secure: true`
- `sameSite`: сейчас `lax` (single-domain сценарий)
- `path`: `/`
- `domain`: опционально через `AUTH_COOKIE_DOMAIN` (пусто -> атрибут не выставляется)

## Имена cookies и scope

Сейчас используются role-specific имена, чтобы в одном браузере можно было жить в двух ролях параллельно:

- Candidate:
  - `candidate_access_token`
  - `candidate_refresh_token`
- Employer:
  - `employer_access_token`
  - `employer_refresh_token`

Имена настраиваются через env:

- `CANDIDATE_ACCESS_COOKIE_NAME`
- `CANDIDATE_REFRESH_COOKIE_NAME`
- `EMPLOYER_ACCESS_COOKIE_NAME`
- `EMPLOYER_REFRESH_COOKIE_NAME`

## Переменные окружения

- `AUTH_COOKIE_DOMAIN`
- `AUTH_COOKIE_SECURE`
- `CANDIDATE_ACCESS_COOKIE_NAME`
- `CANDIDATE_REFRESH_COOKIE_NAME`
- `EMPLOYER_ACCESS_COOKIE_NAME`
- `EMPLOYER_REFRESH_COOKIE_NAME`
- `COOKIE_SECRET` (используется в `cookie-parser`)
- `JWT_ACCESS_EXPIRES_IN`
- `REFRESH_TOKEN_EXPIRES_IN`
- `CORS_ORIGIN` (должен быть явным, если используются credentials/cookies)

## Контракт обработки ошибок

- Refresh:
  - если `POST /auth/refresh` возвращает `401`, контроллер очищает обе auth-cookies
- Logout:
  - при успехе очищаются обе cookies
  - при невалидной/протухшей auth-сессии тоже очищаются обе cookies

Это гарантирует, что после невалидной сессии cookies не остаются рабочими для следующих запросов.

## Как пользоваться

1. Login: `POST /auth/login`
   - в body передаются `userId`, `roleContextId`, `userRole`
   - сервер ставит две HttpOnly cookies
2. Refresh: `POST /auth/refresh`
   - сервер читает refresh-cookie, валидирует/ротирует пару токенов, обновляет cookies
3. Logout: `POST /auth/logout`
   - сервер удаляет token-сессию и очищает обе cookies
