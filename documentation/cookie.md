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
- Одновременная работа в двух ролях через разные cookie имена **отменена**.
  Теперь используется один стандартный набор cookie для текущей сессии:
  - `access_token`
  - `refresh_token`

## Соответствие API (текущее)

Текущий API сервиса:

- `setAccessToken(response, accessToken)`
- `setRefreshToken(response, refreshToken)`
- `getAccessToken(request) -> string | undefined`
- `getRefreshToken(request) -> string | undefined`
- `clearAuthCookies(response)`

## Поведение cookies

- Для access и refresh выставляется `httpOnly: true`
- `secure`:
  - принудительно через `AUTH_COOKIE_SECURE=true|false`
  - иначе fallback: `NODE_ENV === production` -> `secure: true`
- `sameSite`: сейчас `lax` (single-domain сценарий)
- `path`: `/`
- `domain`: опционально через `AUTH_COOKIE_DOMAIN` (пусто -> атрибут не выставляется)

## Имена cookies

Используются единые auth-cookie:

- `access_token`
- `refresh_token`

Имена можно переопределить через env:

- `ACCESS_COOKIE_NAME`
- `REFRESH_COOKIE_NAME`

## Переменные окружения

- `AUTH_COOKIE_DOMAIN`
- `AUTH_COOKIE_SECURE`
- `ACCESS_COOKIE_NAME`
- `REFRESH_COOKIE_NAME`
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
   - сервер ставит `access_token` и `refresh_token` (HttpOnly)
2. Refresh: `POST /auth/refresh`
   - сервер читает refresh-cookie, валидирует/ротирует пару токенов, обновляет cookies
3. Logout: `POST /auth/logout`
   - сервер удаляет token-сессию и очищает обе cookies
