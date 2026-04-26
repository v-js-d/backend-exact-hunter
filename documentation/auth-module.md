# Auth Module (временная тестовая реализация)

## Важно: обновление контракта

- В этой ветке тип пары токенов унифицирован и реэкспортируется из token-модуля:
  - `export type { AuthTokenPair } from '@/common/auth';`
- `TokenModule` сейчас в процессе PR. Если возникают конфликты, по контракту пары токенов (`accessToken`, `refreshToken`) ориентируемся на эту ветку.

## Назначение

Текущий `auth` модуль сделан намеренно простым, чтобы быстро и прозрачно проверить end-to-end сценарии cookies + refresh-сессий.

Это пока не полноценный production auth (логин по email/password и т.д. ещё не внедрён).

## Структура модуля

`src/modules/auth/`

- `controllers/auth.controller.ts`
- `services/auth.service.ts`
- `dto/auth-session.request.dto.ts`
- `dto/auth-session.response.dto.ts`
- `dto/auth-logout.response.dto.ts`
- `auth.module.ts`
- `index.ts`

## Эндпоинты

- `POST /auth/login` — body: `AuthSessionRequestDto` (`userId`, `roleContextId`, `userRole`)
- `POST /auth/refresh` — **без body**; access + refresh только в HttpOnly cookies
- `GET /auth/me` — защищён `@AuthAccess()`
- `POST /auth/logout` — защищён `@AuthAccess()`

Разрешённые роли для cookie-auth: `CANDIDATE`, `EMPLOYER`.

## Как это работает

- `AuthService` проверяет `roleContext` в БД и строит payload для токена.
- `TokenService` выпускает/валидирует/ротирует refresh-сессии.
- На `POST /auth/login` и `POST /auth/refresh` (с декоратором `@SetAuthCookie()`) **запись** access/refresh в HttpOnly куки делает **`AuthCookieInterceptor`**: сервис возвращает `tokens` в объекте ответа, интерцептор ставит `Set-Cookie` и **удаляет** `tokens` из тела. Очистка кук при ошибках, **logout** и чтение кук для refresh в коде `AuthService` — через `AuthCookieService` напрямую.
- `cookie-parser` подключен в `main.ts`, поэтому доступны `req.cookies`.

## Контракт поведения

- Login:
  - создаёт refresh-сессию в таблице `tokens`
  - в ответе возвращается `tokens` → `@SetAuthCookie` / `AuthCookieInterceptor` выставляет access + refresh в куки и убирает `tokens` из JSON
- Refresh (успех):
  - валидирует текущую refresh-сессию
  - ротирует сессию (старая удаляется, новая создаётся)
  - то же: `tokens` в return → интерцептор пишет куки, тело без секретов
- Refresh (ошибка, `401`):
  - `AuthService` очищает обе auth-cookies
- Logout:
  - пытается удалить текущую сессию
  - в любом случае очищает обе auth-cookies

## Текущие ограничения (осознанные)

- Нет полноценного credential flow (это тестовый session API).
- Пока нет отдельного публичного `getAccessToken(req)` сценария.
- Используется один набор auth-cookie (`access_token`, `refresh_token`), одновременная работа в двух ролях в одном браузере не поддерживается в текущем контракте.
- Роль `ADMIN` осознанно исключена из cookie-auth потока на данном этапе.

## Зачем модуль добавлен сейчас

Этот модуль нужен, чтобы стабилизировать базовый контракт:

- централизованные настройки cookies
- обязательная очистка cookies на ошибках refresh/logout
- корректная ротация refresh-сессий в БД

После подтверждения сценариев модуль можно развить до полноценного auth с реальными use-case логина, guard-ами и более полной доменной моделью.
