# 🏛️ Arquitetura do Sistema

## Visão Geral

Este projeto implementa **Clean Architecture** com separação clara de responsabilidades:

```
┌─────────────────────────────────────────────────────────┐
│                    INTERFACES LAYER                      │
│  (Controllers, DTOs, Guards, Filters, Strategies)       │
│                                                          │
│  ┌────────────────┐  ┌─────────────────┐               │
│  │ AuthController │  │ UsersController │               │
│  └────────────────┘  └─────────────────┘               │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                      │
│              (Use Cases - Business Logic)                │
│                                                          │
│  ┌──────────────┐ ┌────────┐ ┌───────────────┐         │
│  │ RegisterUser │ │ Login  │ │ ConsumeCredit │         │
│  └──────────────┘ └────────┘ └───────────────┘         │
│  ┌──────────────┐ ┌─────────────────┐                  │
│  │ AddCredits   │ │ GetUserCredits  │                  │
│  └──────────────┘ └─────────────────┘                  │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                     DOMAIN LAYER                         │
│        (Entities, Business Rules, Interfaces)           │
│                                                          │
│  ┌──────────────┐  ┌──────────────────┐                │
│  │ User Entity  │  │ IUserRepository  │                │
│  │              │  │   (Interface)    │                │
│  │ - id         │  └──────────────────┘                │
│  │ - email      │  ┌──────────────────┐                │
│  │ - credits    │  │  IHashService    │                │
│  │ - role       │  │   (Interface)    │                │
│  │              │  └──────────────────┘                │
│  │ Methods:     │                                       │
│  │ consumeCredit()                                      │
│  │ addCredits()                                         │
│  │ hasCredits()                                         │
│  │ isAdmin()                                            │
│  └──────────────┘                                       │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                 INFRASTRUCTURE LAYER                     │
│        (Database, External Services, Frameworks)        │
│                                                          │
│  ┌────────────────────┐  ┌──────────────────┐          │
│  │ PrismaUserRepo     │  │ BcryptHashService│          │
│  │ (implements        │  │ (implements      │          │
│  │  IUserRepository)  │  │  IHashService)   │          │
│  └────────────────────┘  └──────────────────┘          │
│  ┌────────────────────┐                                 │
│  │  PrismaService     │                                 │
│  │  (SQLite Database) │                                 │
│  └────────────────────┘                                 │
└─────────────────────────────────────────────────────────┘
```

## 🎯 Fluxo de uma Requisição

### Exemplo: Consumir Crédito

```
1. HTTP Request
   POST /users/consume-credit
   Authorization: Bearer token
        │
        ▼
2. UsersController
   - Valida autenticação (JwtAuthGuard)
   - Extrai userId do token
        │
        ▼
3. ConsumeCreditUseCase
   - Busca usuário
   - Valida se tem créditos
   - Executa regra de negócio
        │
        ▼
4. User Entity (Domain)
   - user.consumeCredit()
   - Decrementa 1 crédito
   - Atualiza timestamp
        │
        ▼
5. PrismaUserRepository
   - Persiste no banco
        │
        ▼
6. Response
   {
     "remainingCredits": 9,
     "message": "Credit consumed successfully"
   }
```

## 📦 Dependências entre Camadas

```
Interfaces ──────depends on──────▶ Application
                                        │
Application ─────depends on──────▶ Domain (Interfaces)
                                        │
Infrastructure ──implements──────▶ Domain (Interfaces)
                                        │
Domain ──────────────────────────▶ Não depende de nada!
```

### Princípios Aplicados:

✅ **Dependency Inversion** - Camadas superiores dependem de abstrações
✅ **Single Responsibility** - Cada camada tem uma responsabilidade clara
✅ **Open/Closed** - Aberto para extensão, fechado para modificação
✅ **Interface Segregation** - Interfaces específicas por necessidade
✅ **Liskov Substitution** - Implementações podem ser substituídas

## 🔐 Segurança e Guards

```
Request
   │
   ▼
JwtAuthGuard ──────▶ Valida token JWT
   │                  Extrai payload
   │                  Injeta user no request
   ▼
AdminGuard ────────▶ Valida se user.role === 'ADMIN'
   │
   ▼
Controller ────────▶ Executa lógica
```

## 💾 Persistência

```
Use Case
   │
   ▼
IUserRepository (Interface no Domain)
   │
   ▼
PrismaUserRepository (Implementation)
   │
   ▼
PrismaService
   │
   ▼
SQLite Database
```

## 🧪 Testabilidade

A arquitetura facilita testes em diferentes níveis:

### Unit Tests (Use Cases)
```typescript
// Mock do repositório
const mockRepo = {
  findById: jest.fn(),
  save: jest.fn()
};

// Testa apenas a lógica
const useCase = new ConsumeCreditUseCase(mockRepo);
```

### Integration Tests (Repository)
```typescript
// Testa com banco de dados real
const prisma = new PrismaService();
const repo = new PrismaUserRepository(prisma);
```

### E2E Tests (Controllers)
```typescript
// Testa o fluxo completo
request(app)
  .post('/users/consume-credit')
  .set('Authorization', `Bearer ${token}`)
  .expect(200);
```

## 🎨 Benefícios da Arquitetura

1. **Testável** - Cada camada pode ser testada isoladamente
2. **Manutenível** - Mudanças em uma camada não afetam outras
3. **Escalável** - Fácil adicionar novos casos de uso
4. **Framework Agnóstico** - Domain não depende de NestJS
5. **Clean Code** - Código organizado e com responsabilidades claras
