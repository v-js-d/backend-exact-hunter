# Backend Module Structure Examples

Практические примеры структуры модулей проекта.

---

## 1. Simple Module

Используется для небольших или технических модулей.

**Примеры:** smoke, health, ping, webhook.

### Пример структуры

```
src/modules/smoke/
  controllers/
    smoke.controller.ts
  services/
    smoke.service.ts
  dto/
    smoke-response.dto.ts
  smoke.module.ts
  index.ts
```

### Файлы

**smoke.module.ts**

```typescript
@Module({
	controllers: [SmokeController],
	providers: [SmokeService],
})
export class SmokeModule {}
```

**smoke.controller.ts**

```typescript
@Controller('smoke')
export class SmokeController {
	constructor(private readonly smokeService: SmokeService) {}

	@Get()
	check() {
		return this.smokeService.check();
	}
}
```

**smoke.service.ts**

```typescript
@Injectable()
export class SmokeService {
	check() {
		return {
			status: 'ok',
			timestamp: new Date().toISOString(),
		};
	}
}
```

---

## 2. Full Module

Используется для бизнес-модулей.

**Примеры:** auth, users, vacancies, applications, resumes.

### Пример структуры

```
src/modules/auth/
  controllers/
    auth.controller.ts
  services/
    password.service.ts
    token.service.ts
  use-cases/
    login-user.use-case.ts
    register-user.use-case.ts
  repositories/
    users.repository.ts
  dto/
    login.dto.ts
    register.dto.ts
  auth.module.ts
  index.ts
```

---

## 3. Пример use-case

```typescript
@Injectable()
export class LoginUserUseCase {
	constructor(
		private usersRepository: UsersRepository,
		private passwordService: PasswordService,
		private tokenService: TokenService,
	) {}

	async execute(dto: LoginDto) {
		const user = await this.usersRepository.findByEmail(dto.email);

		const isValidPassword = await this.passwordService.compare(dto.password, user.passwordHash);

		if (!isValidPassword) {
			throw new UnauthorizedException();
		}

		return this.tokenService.issueTokens(user);
	}
}
```

---

## 4. Пример Repository

```typescript
@Injectable()
export class UsersRepository {
	constructor(private prisma: PrismaService) {}

	findByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: { email },
		});
	}

	create(data: CreateUserDto) {
		return this.prisma.user.create({
			data,
		});
	}
}
```

---

## 5. Примеры use-case по доменам

**Use-case** - конкретная операция системы.

| Домен            | Use-case                                                                         |
| ---------------- | -------------------------------------------------------------------------------- |
| **Auth**         | login user, register user, refresh session, logout user                          |
| **Vacancies**    | create vacancy, update vacancy, publish vacancy, archive vacancy, list vacancies |
| **Applications** | apply to vacancy, cancel application, invite candidate, reject candidate         |

---

## 6. Service vs Use-case

|             | Use-case                                   | Service                                                |
| ----------- | ------------------------------------------ | ------------------------------------------------------ |
| **Роль**    | Бизнес-сценарий целиком                    | Переиспользуемая логика                                |
| **Примеры** | `LoginUserUseCase`, `CreateVacancyUseCase` | `PasswordService`, `TokenService`, `PermissionService` |

---

## 7. Итоговая структура модуля

```
feature-module/
  controllers/
    feature.controller.ts
  services/
    feature.service.ts
  use-cases/          # опционально
  repositories/       # опционально
  dto/                # опционально
  feature.module.ts
  index.ts
```

---

## 8. Правило роста модуля

Допустимый путь развития модуля:

```
Simple module
      ↓
появилась сложность
      ↓
Full module
```
