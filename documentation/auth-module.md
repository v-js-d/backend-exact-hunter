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
- `dto/auth-session.dto.ts`
- `dto/auth-session-response.dto.ts`
- `auth.module.ts`
- `index.ts`

## Эндпоинты

- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`

Формат body (для всех эндпоинтов):

```json
{
	"userId": "uuid",
	"roleContextId": "uuid",
	"userRole": "CANDIDATE"
}
```

Разрешённые роли для cookie-auth: `CANDIDATE`, `EMPLOYER`.

## Как это работает

- `AuthService` проверяет `roleContext` в БД и строит payload для токена.
- `TokenService` выпускает/валидирует/ротирует refresh-сессии.
- `AuthCookieService` ставит и очищает HttpOnly cookies.
- `cookie-parser` подключен в `main.ts`, поэтому доступны `req.cookies`.

## Контракт поведения

- Login:
  - создаёт refresh-сессию в таблице `tokens`
  - выставляет access + refresh cookies
- Refresh (успех):
  - валидирует текущую refresh-сессию
  - ротирует сессию (старая удаляется, новая создаётся)
  - обновляет cookies
- Refresh (`401`):
  - контроллер очищает обе auth-cookies
- Logout:
  - пытается удалить текущую сессию
  - в любом случае очищает обе auth-cookies

## Текущие ограничения (осознанные)

- Нет полноценного credential flow (это тестовый session API).
- Пока нет отдельного публичного `getAccessToken(req)` сценария.
- Имена cookies role-specific (candidate/employer), чтобы можно было параллельно сидеть в двух ролях в одном браузере.
- Роль `ADMIN` осознанно исключена из cookie-auth потока на данном этапе.

## Зачем модуль добавлен сейчас

Этот модуль нужен, чтобы стабилизировать базовый контракт:

- централизованные настройки cookies
- обязательная очистка cookies на ошибках refresh/logout
- корректная ротация refresh-сессий в БД

После подтверждения сценариев модуль можно развить до полноценного auth с реальными use-case логина, guard-ами и более полной доменной моделью.
