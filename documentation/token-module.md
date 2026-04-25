# Token Module

Модуль управления JWT access-токенами и refresh-сессиями.

## Назначение

Централизует всю логику работы с токенами:

- генерация access JWT
- генерация, хэширование и валидация refresh token
- rotation (ротация) refresh-сессий
- logout (удаление сессий)

Модуль экспортирует `TokenService` — его инжектят use-case'ы из `auth` и других модулей.

## Архитектура

```
token/
  consts/
    token.consts.ts         — константы (salt rounds, token bytes, enums)
  types/
    token.type.ts           — интерфейсы (payload, meta, params)
  repositories/
    token.repository.ts     — абстрактный контракт (DI-токен)
    token.prisma.repository.ts — реализация через Prisma
  services/
    token.service.ts        — бизнес-логика токенов
  token.module.ts
  index.ts
```

Repository подключен через DI-абстракцию: `TokenRepository` (abstract class) → `TokenPrismaRepository` (реализация). При необходимости можно заменить на Redis/другое хранилище без изменения сервиса.

## Принцип работы

### Access Token (JWT)

- Генерируется `JwtService.sign()` с секретом из `JWT_SECRET`
- TTL из `JWT_ACCESS_EXPIRES_IN` (например `15m`)
- Payload: `sub` (userId), `roleContextId`, `userRole`, `companyId?`, `hrRoleName?`
- Не хранится в БД — валидируется по подписи
- При logout cookie очищается, но сам токен живёт до истечения TTL

### Refresh Token (random string + bcrypt)

- Генерируется `crypto.randomBytes(32)` → 64 hex-символа
- В cookie отдаётся plain-значение
- В БД (таблица `tokens`) хранится **только bcrypt hash**
- TTL из `REFRESH_TOKEN_EXPIRES_IN` (например `7d`), конвертируется пакетом `ms`
- Привязан к `userId + roleContextId + deviceId` (unique constraint в БД)

### Rotation

При refresh запросе:

1. Найти запись по `(userId, roleContextId, deviceId)`
2. Проверить `expiresAt` и bcrypt compare
3. Удалить старую запись
4. Создать новую запись с новым hash и новым expiresAt
5. Вернуть новую пару `{ accessToken, refreshToken }` (`AuthTokenPair`)

### Logout

- `removeToken()` — удаляет одну сессию (конкретное устройство)
- `removeAllUserTokens()` — удаляет все сессии пользователя (logout everywhere)

## API TokenService

| Метод                                                          | Описание                                                      |
| -------------------------------------------------------------- | ------------------------------------------------------------- |
| `generateAccessToken(payload)`                                 | JWT подпись payload с секретом и TTL из конфига               |
| `generateRefreshToken()`                                       | Криптостойкая случайная строка (32 bytes → hex)               |
| `hashRefreshToken(plain)`                                      | bcrypt hash для сохранения в БД                               |
| `compareRefreshToken(plain, hash)`                             | bcrypt compare для валидации                                  |
| `saveToken(userId, roleContextId, refreshToken, meta)`         | Хэширует refresh и сохраняет запись в БД                      |
| `generateTokenPair(payload, meta)`                             | Генерирует access + refresh, сохраняет в БД, возвращает пару  |
| `validateAccessToken(accessToken)`                             | Верифицирует JWT, возвращает payload или бросает 401          |
| `validateRefreshToken(plain, userId, roleContextId, deviceId)` | Проверяет expiresAt + hash, бросает 401 при невалидности      |
| `rotateRefreshToken(payload, meta)`                            | Удаляет старую сессию → создаёт новую → возвращает новую пару |
| `removeToken(userId, roleContextId, deviceId)`                 | Удаляет одну refresh-сессию                                   |
| `removeAllUserTokens(userId)`                                  | Удаляет все refresh-сессии пользователя                       |

## Типы

`AuthTokenPair` объявлен в `src/common/auth/token.type.ts` и реэкспортируется из `token/types/token.type.ts`.

```typescript
interface AccessTokenPayload {
	sub: string; // userId
	roleContextId: string;
	userRole: string; // CANDIDATE | EMPLOYER | ADMIN
	companyId?: string; // для EMPLOYER
	hrRoleName?: string; // для EMPLOYER
}

interface AuthTokenPair {
	accessToken: string;
	refreshToken: string;
}

interface RequestMeta {
	deviceId: string;
	deviceName?: string;
	userAgent?: string;
	ipAddress?: string;
}
```

## Переменные окружения

| Переменная                 | Пример               | Описание               |
| -------------------------- | -------------------- | ---------------------- |
| `JWT_SECRET`               | `some-strong-secret` | Секрет для подписи JWT |
| `JWT_ACCESS_EXPIRES_IN`    | `15m`                | TTL access-токена      |
| `REFRESH_TOKEN_EXPIRES_IN` | `7d`                 | TTL refresh-сессии     |

Форматы TTL: `30s`, `15m`, `2h`, `7d` (парсит пакет `ms`).

## Зависимости

| Пакет         | Зачем                              |
| ------------- | ---------------------------------- |
| `@nestjs/jwt` | Подпись и верификация JWT          |
| `bcrypt`      | Хэширование refresh token          |
| `ms`          | Парсинг duration-строк (`7d` → ms) |

## Использование в auth модуле

```typescript
@Module({
	imports: [TokenModule],
	// ...
})
export class AuthModule {}
```

```typescript
// в use-case
const pair = await this.tokenService.generateTokenPair(
	{ sub: user.id, roleContextId, userRole: 'CANDIDATE' },
	{ deviceId, userAgent, ipAddress },
);
// pair.accessToken → в cookie
// pair.refreshToken → в HttpOnly cookie
```
