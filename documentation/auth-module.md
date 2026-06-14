# Auth API — кратко для фронта и merge

## Куки и токены

- **Access JWT** и **refresh** (opaque) сервер читает из **HttpOnly** cookies (имена по умолчанию: `access_token`, `refresh_token`; см. `documentation/cookie.md`). Фронт **не кладёт** их в `localStorage` и **не шлёт** в body.
- Запросы с сессией: `fetch(..., { credentials: 'include' })` (или axios `withCredentials: true`).
- После `@SetAuthCookie()` интерцептор **удаляет** `tokens` из JSON — в теле остаётся только публичная часть ответа.

## Эндпоинты (фактический контракт сейчас)

`POST /auth/register` — body `RegisterDto`, `@SetAuthCookie`, после интерцептора тело `{ id, isActivated }`, HTTP **201**.

`POST /auth/login` — body `LoginDto`, `@SetAuthCookie`, после интерцептора тело `{ id, isActivated }`, HTTP **200**.

`POST /auth/refresh` — без body, `@SetAuthCookie`, HTTP **204** (тело без полезной JSON-нагрузки в типичном сценарии).

`POST /auth/logout` — куки очищаются, тело `{ ok: true }`, HTTP **200**.

`GET /auth/me` — тело `{ id, isActivated }`, HTTP **200**.

**Guard:** `GET /auth/me`, `POST /auth/logout` — `@AuthAccess()` (JWT из access-cookie).

## DTO / валидация (`src/modules/auth/dto/...`)

- **RegisterDto / LoginDto:** `email` (`@IsEmail`), `password` (`@IsStrongPassord`), `role` — enum **Prisma** `UserRole`: `CANDIDATE` \| `EMPLOYER` \| `ADMIN` (для register/login допускаются только **CANDIDATE** и **EMPLOYER**, иначе 401 с кодом из `EnumAuthError`).
- **Refresh:** body не нужен (MVP).
- **Me:** отдельного request DTO нет — данные из `request.user` после guard.

## Ошибки (ориентир)

- **401:** нет/битый access (в т.ч. `GET /auth/me`); нет/битый refresh или ошибка ротации (`POST /auth/refresh`); неверные креды / роль / пользователь (`POST /auth/login`); запрещённая роль при register.
- **409:** `POST /auth/register` — email уже есть (`USER_EMAIL_ALREADY_EXISTS`).
- Формат тела ошибок — **глобальный фильтр** (`GlobalExceptionFilter` / `@core/response`), не размечать вручную в каждом хендлере.

## Swagger

- Описать security: access читается из **cookie** (JWT), не обязательно Bearer в header — привести в соответствие с реальным `AccessJwtStrategy`.
- Указать, что login/register/refresh выставляют HttpOnly cookies; токены в Swagger-response для login/register — в схеме могут фигурировать до интерцептора; фактически клиент их в JSON не получает.

## Сделано (кратко)

- Cookie-based access + refresh, ротация refresh, logout с очисткой cookies (`AuthService` + `TokenService` + `AuthCookieInterceptor`).
- `RegisterUseCase` / `LoginUseCase`, хеш пароля при register (bcrypt), `isActivated: true` сразу (MVP без почты), после register — выдача пары токенов и те же куки, что при login.
- Поиск `RoleContext` по пользователю: `findFirstForUserWithHrRole(userId, userRole)` (не по id контекста с user.id).
- `UserService` / `RoleContextService` как публичный API модулей; auth-context для JWT payload.

## Не сделано относительно целевого контракта (MVP+ / спека)

- Тело **`{ user: { id, email, role } }`** на register/login/refresh — сейчас плоское **`{ id, isActivated }`**; **email/role** в этих ответах не отдаются.
- Роль **`RECRUITER` в API** и маппинг на **`EMPLOYER`** в БД; поля компании для рекрутера; **`CandidateProfile`** при кандидате; поиск **`HR_ADMIN`** и создание **Company** — не реализованы.
- **`GET /auth/me`:** нет `email`, нет `role` / `userRoleName` (только `id`, `isActivated`).
- **`POST /auth/login`:** сравнение пароля с hash в БД (**bcrypt.compare**) **не подключено** — принимается любой пароль при верном email и роли.
- **`POST /auth/refresh`:** в спеке ожидался JSON с пользователем; сейчас **204** без тела с профилем.
- **`POST /auth/logout`:** ответ `{ ok: true }`, не `{ message: string }`.
- **Swagger:** полная security-схема под cookies + описание для фронта — в работе.

## Структура кода

`src/modules/auth/` — `controllers/`, `services/`, `use-cases/`, `dto/` (в т.ч. `login/`, `register/`, `me/`, `logout/`, `auth-session/`), `guards/`, `strategies/`, `types/`, `consts/`.
