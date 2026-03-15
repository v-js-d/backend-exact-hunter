# Backend Architecture Guide

Документ фиксирует базовые архитектурные правила проекта.

## Цель

- единая структура кода
- понятные роли слоёв
- предсказуемые code review
- возможность масштабирования проекта

---

## 1. Основной принцип

Backend построен на: **Modular architecture** + **Layered architecture**.

```
Module (feature)
   ↓
Controller
   ↓
Use-case
   ↓
Service
   ↓
Repository
   ↓
Database
```

> Не все модули обязаны использовать все слои.

---

## 2. Module

**Module** - отдельная бизнес-область системы.

**Примеры модулей:**

- auth
- users
- vacancies
- applications
- resumes
- notifications

**Правило:** один модуль = одна предметная область.

**Нельзя** создавать модули типа: `controllers`, `services`, `repositories`.  
Структура должна быть **feature-first**, а не type-first.

---

## 3. Controller

**Controller** - точка входа HTTP-запросов.

**Отвечает за:**

- обработку request
- валидацию DTO
- вызов use-case
- возврат response

**Не должен:**

- содержать бизнес-логику
- работать напрямую с базой
- содержать сложные вычисления

**Пример:**

```typescript
@Controller('auth')
export class AuthController {
	constructor(private loginUserUseCase: LoginUserUseCase) {}

	@Post('login')
	login(@Body() dto: LoginDto) {
		return this.loginUserUseCase.execute(dto);
	}
}
```

---

## 4. Use-case

**Use-case** - один конкретный бизнес-сценарий системы.

**Примеры:** `RegisterUserUseCase`, `LoginUserUseCase`, `CreateVacancyUseCase`, `ApplyToVacancyUseCase`.

**Отвечает за:**

- orchestration бизнес-логики
- вызов сервисов
- работу с репозиториями
- выполнение сценария от начала до конца

**Не должен:**

- работать напрямую с HTTP
- возвращать Nest response-объекты
- содержать инфраструктурную логику

---

## 5. Service

**Service** - переиспользуемая бизнес-логика.

**Используется:** внутри use-case и внутри других сервисов.

**Примеры:** `PasswordService`, `TokenService`, `PermissionService`.

**Отвечает за:**

- отдельные операции
- бизнес-правила
- вспомогательную доменную логику

Service не является сценарием, в отличие от use-case.

---

## 6. Repository

**Repository** - слой доступа к данным.

**Отвечает за:**

- работу с базой (Prisma / TypeORM)
- получение и сохранение данных

**Не должен** содержать бизнес-логику.

---

## 7. Типы модулей

В проекте используются два типа модулей:

- **Simple module**
- **Full module**

---

## 8. Simple Module

Используется для маленьких или технических модулей.

**Примеры:** smoke, health, webhook.

**Структура:**

```
feature/
  controllers/
    feature.controller.ts
  services/
    feature.service.ts
  dto/                    # если есть
  feature.module.ts
  index.ts
```

Для единообразия папки `controllers` и `services` используются даже при одном файле. Это позволяет:

- сохранять одинаковую структуру simple и full модулей
- избегать перемещения файлов при росте модуля
- делать структуру проекта предсказуемой

---

## 9. Full Module

Используется для бизнес-модулей.

**Примеры:** auth, users, vacancies, applications, resumes.

**Структура:**

```
feature/
  controllers/
  services/
  use-cases/
  repositories/
  dto/
  feature.module.ts
  index.ts
```

---

## 10. Когда модуль должен стать Full

Модуль переводится в Full, если появляется:

- доступ к базе данных
- несколько бизнес-операций
- use-cases
- события, очереди
- внешние интеграции

Simple-модули можно постепенно выращивать в Full.

---

## 11. Правило index.ts

Каждый модуль должен иметь `index.ts`.

**Назначение:**

- экспорт публичного API модуля
- ограничение утечки внутренних зависимостей

---

## 12. Что запрещено

- писать бизнес-логику в controller
- работать с базой из controller
- смешивать инфраструктуру и бизнес-логику
- создавать модули без привязки к предметной области
