# Auth Strategy: cookie-only access JWT + явный refresh

## Защищённые маршруты

Access JWT передаётся только в HttpOnly cookie. На эндпоинты с `@AuthAccess()` стоят `AccessJwtGuard` и при необходимости `RolesGuard`.

`AccessJwtGuard` только проверяет access через Passport-стратегию `access-jwt`: подпись `JWT_SECRET`, claim `exp`, затем `AuthContextService.buildAuthenticatedUser` (поход в БД по payload). Без валидного access — **401** с кодом из `EnumTokenError` (`ACCESS_TOKEN_MISSING`, `ACCESS_TOKEN_EXPIRED`, `ACCESS_TOKEN_INVALID`). Скрытой ротации в guard **нет**: просроченный access не «лечится» внутри одного запроса.

## Refresh

`POST /auth/refresh` — пустое тело, в запросе две куки: **access** (допустимо просроченный, но с валидной подписью) и **refresh**. Сервис декодирует access с `ignoreExpiration: true`, валидирует refresh в БД, ротирует пару, возвращает `tokens` в объекте — `@SetAuthCookie` пишет `Set-Cookie` и убирает `tokens` из тела. Ошибка — **401**, куки очищает сервис. Только с одной refresh-кукой без access по текущей схеме БД (хэш refresh) идентифицировать сессию нельзя.

## Фронт

После `401` с `ACCESS_TOKEN_EXPIRED` (или по политике — и на другие коды) вызвать `POST /auth/refresh` с `credentials: 'include'`, один retry исходного запроса, защита от бесконечного цикла. Не доверять телу ответа для идентичности сессии — вся идентичность в куках.

## Роли

`@AuthAccess()` — любой авторизованный; `@AuthAccess(UserRole.…)` / `@CandidateAccess()` / `@EmployerAccess()` — фильтр по `request.user.currentRole`. Метаданные — `@Roles(...)`, проверка в `RolesGuard` после `AccessJwtGuard`.

## Ограничения и риски (как и раньше)

Полноценного логина email/password нет. В cookie-потоке нет `ADMIN`. Параллельный refresh с двух вкладок по-прежнему может дать гонку на ротации — смотри отдельные доработки (grace / single-flight / throttling на `/auth/refresh`).

## Как проверить

Нет access-куки — `GET /auth/me` → 401 `ACCESS_TOKEN_MISSING` (или аналог). Просроченный access — 401 `ACCESS_TOKEN_EXPIRED`. С валидным access — 200, `AuthMeResponseDto`. После `POST /auth/refresh` с валидной парой кук — 204 и свежие `Set-Cookie`, следующий `GET /me` с новым access — 200. Подделанная подпись access — 401 `ACCESS_TOKEN_INVALID`, refresh не вызывается.

## `@SetAuthCookie()` и `AuthCookieInterceptor`

**Где:** `SetAuthCookie` — декоратор в `src/common/decorators/auth/set-auth-cookie.decorator.ts`, обёртка над `@UseInterceptors(AuthCookieInterceptor)`. Вешается **на хендлер** (например `POST /auth/login`, `POST /auth/refresh`), который должен в ответе **выставить HttpOnly куки** с парой токенов, **без** ручного `response.cookie` в сервисе/контроллере.

**Как устроен `AuthCookieInterceptor`:** после выполнения хендлера, в `tap` по **телу ответа** до `ResponseInterceptor`, смотрит объект `data`. Если в нём есть `data.tokens` с `accessToken` / `refreshToken` — вызывает `AuthCookieService.setAccessToken` / `setRefreshToken` на `response`, затем **`delete data.tokens`**, чтобы в JSON (обёртка `{ result: ... }`) **токены в теле не попали** — сессия только в куках.

**Сервис:** `AuthService.login` / `AuthService.refresh` **не** вызывают `setAccessToken`/`setRefreshToken`; они возвращают `AuthTokenPair` в поле `tokens` в структуре ответа. Исключение: **чтение** кук/очистка при ошибках (например refresh) и **logout** по-прежнему требуют `AuthCookieService` **в сервисе** (нет «успешного body» с `tokens` — интерцептору нечего поставить).

**Важно:** сработает только если хендлер **возвращает** объект **с** `tokens`; порядок глобальных интерцепторов: `AuthCookie` должен отрабатывать **до** оборачивания в `{ result }` (локальный `@UseInterceptors` у метода ближе к хендлеру, чем глобальный `ResponseInterceptor` в `main.ts`).
