# 🧪 Estrutura de Testes

## 📚 Visão Geral

A arquitetura Clean facilita testes em diferentes níveis. Cada camada pode ser testada isoladamente.

```
├── Unit Tests        → Domain & Application (Lógica de negócio)
├── Integration Tests → Infrastructure (Repositórios)
└── E2E Tests         → Interfaces (Controllers)
```

---

## 🎯 1. Testes Unitários (Use Cases)

### Exemplo: `consume-credit.use-case.spec.ts`

```typescript
import { ConsumeCreditUseCase } from '@application/use-cases/consume-credit.use-case';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { User, UserRole } from '@domain/entities/user.entity';
import {
  InsufficientCreditsException,
  UserNotFoundException,
} from '@domain/exceptions/domain.exceptions';

describe('ConsumeCreditUseCase', () => {
  let useCase: ConsumeCreditUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    // Mock do repositório
    userRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
    };

    useCase = new ConsumeCreditUseCase(userRepository);
  });

  describe('execute', () => {
    it('deve consumir 1 crédito com sucesso', async () => {
      // Arrange
      const user = User.create({
        email: 'test@example.com',
        password: 'hashedpassword',
        credits: 10,
        role: UserRole.USER,
      });

      userRepository.findById.mockResolvedValue(user);
      userRepository.save.mockResolvedValue(user);

      // Act
      const result = await useCase.execute({ userId: user.id });

      // Assert
      expect(result.remainingCredits).toBe(9);
      expect(result.message).toBe('Credit consumed successfully');
      expect(userRepository.save).toHaveBeenCalledWith(user);
    });

    it('deve lançar UserNotFoundException quando usuário não existe', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        useCase.execute({ userId: 'non-existent-id' }),
      ).rejects.toThrow(UserNotFoundException);
    });

    it('deve lançar InsufficientCreditsException quando não há créditos', async () => {
      // Arrange
      const user = User.create({
        email: 'test@example.com',
        password: 'hashedpassword',
        credits: 0,
        role: UserRole.USER,
      });

      userRepository.findById.mockResolvedValue(user);

      // Act & Assert
      await expect(useCase.execute({ userId: user.id })).rejects.toThrow(
        InsufficientCreditsException,
      );
    });
  });
});
```

### Rodar testes unitários:
```bash
npm test consume-credit.use-case.spec.ts
```

---

## 🔗 2. Testes de Integração (Repositórios)

### Exemplo: `prisma-user.repository.spec.ts`

```typescript
import { Test } from '@nestjs/testing';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { PrismaUserRepository } from '@infrastructure/repositories/prisma-user.repository';
import { User, UserRole } from '@domain/entities/user.entity';

describe('PrismaUserRepository', () => {
  let repository: PrismaUserRepository;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PrismaService, PrismaUserRepository],
    }).compile();

    repository = moduleRef.get<PrismaUserRepository>(PrismaUserRepository);
    prisma = moduleRef.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Limpar banco de testes
    await prisma.user.deleteMany();
  });

  describe('create', () => {
    it('deve criar um usuário no banco', async () => {
      // Arrange
      const user = User.create({
        email: 'test@example.com',
        password: 'hashedpassword',
        credits: 10,
        role: UserRole.USER,
      });

      // Act
      const created = await repository.create(user);

      // Assert
      expect(created.email).toBe('test@example.com');
      expect(created.credits).toBe(10);

      // Verificar no banco
      const found = await prisma.user.findUnique({
        where: { id: created.id },
      });
      expect(found).toBeDefined();
    });
  });

  describe('findByEmail', () => {
    it('deve encontrar usuário por email', async () => {
      // Arrange
      const user = User.create({
        email: 'test@example.com',
        password: 'hashedpassword',
        credits: 10,
        role: UserRole.USER,
      });
      await repository.create(user);

      // Act
      const found = await repository.findByEmail('test@example.com');

      // Assert
      expect(found).toBeDefined();
      expect(found?.email).toBe('test@example.com');
    });

    it('deve retornar null quando não encontrar', async () => {
      // Act
      const found = await repository.findByEmail('naoexiste@example.com');

      // Assert
      expect(found).toBeNull();
    });
  });

  describe('save', () => {
    it('deve atualizar créditos do usuário', async () => {
      // Arrange
      const user = User.create({
        email: 'test@example.com',
        password: 'hashedpassword',
        credits: 10,
        role: UserRole.USER,
      });
      const created = await repository.create(user);

      // Act
      created.consumeCredit();
      const updated = await repository.save(created);

      // Assert
      expect(updated.credits).toBe(9);

      // Verificar no banco
      const found = await prisma.user.findUnique({
        where: { id: created.id },
      });
      expect(found?.credits).toBe(9);
    });
  });
});
```

### Configurar banco de testes:

**.env.test:**
```env
DATABASE_URL="file:./test.db"
```

**Rodar:**
```bash
NODE_ENV=test npm test prisma-user.repository.spec.ts
```

---

## 🌐 3. Testes E2E (Controllers)

### Exemplo: `auth.e2e-spec.ts`

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@infrastructure/database/prisma.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    
    prisma = app.get<PrismaService>(PrismaService);
    
    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  describe('/auth/register (POST)', () => {
    it('deve registrar um novo usuário', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'senha123',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.user.email).toBe('test@example.com');
          expect(res.body.user.credits).toBe(10);
          expect(res.body.user.role).toBe('USER');
        });
    });

    it('deve retornar 409 ao registrar email duplicado', async () => {
      // Criar primeiro usuário
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'senha123',
        });

      // Tentar criar novamente
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'senha123',
        })
        .expect(409);
    });

    it('deve retornar 400 para senha curta', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: '123',
        })
        .expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    beforeEach(async () => {
      // Criar usuário para testes de login
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'senha123',
        });
    });

    it('deve fazer login com credenciais corretas', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'senha123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.access_token).toBeDefined();
          expect(res.body.user.email).toBe('test@example.com');
        });
    });

    it('deve retornar 401 para senha incorreta', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'senhaerrada',
        })
        .expect(401);
    });
  });
});
```

### Rodar testes E2E:
```bash
npm run test:e2e
```

---

## 🎯 4. Testes de Domínio (Entities)

### Exemplo: `user.entity.spec.ts`

```typescript
import { User, UserRole } from '@domain/entities/user.entity';

describe('User Entity', () => {
  describe('create', () => {
    it('deve criar um usuário com valores padrão', () => {
      const user = User.create({
        email: 'test@example.com',
        password: 'hashedpassword',
        credits: 10,
        role: UserRole.USER,
      });

      expect(user.id).toBeDefined();
      expect(user.email).toBe('test@example.com');
      expect(user.credits).toBe(10);
      expect(user.role).toBe(UserRole.USER);
    });
  });

  describe('consumeCredit', () => {
    it('deve decrementar 1 crédito', () => {
      const user = User.create({
        email: 'test@example.com',
        password: 'hashedpassword',
        credits: 10,
        role: UserRole.USER,
      });

      user.consumeCredit();

      expect(user.credits).toBe(9);
    });

    it('deve lançar erro quando não há créditos', () => {
      const user = User.create({
        email: 'test@example.com',
        password: 'hashedpassword',
        credits: 0,
        role: UserRole.USER,
      });

      expect(() => user.consumeCredit()).toThrow('Insufficient credits');
    });
  });

  describe('addCredits', () => {
    it('deve adicionar créditos', () => {
      const user = User.create({
        email: 'test@example.com',
        password: 'hashedpassword',
        credits: 10,
        role: UserRole.USER,
      });

      user.addCredits(50);

      expect(user.credits).toBe(60);
    });

    it('deve lançar erro para valores negativos', () => {
      const user = User.create({
        email: 'test@example.com',
        password: 'hashedpassword',
        credits: 10,
        role: UserRole.USER,
      });

      expect(() => user.addCredits(-10)).toThrow('Amount must be positive');
    });
  });

  describe('isAdmin', () => {
    it('deve retornar true para admin', () => {
      const admin = User.create({
        email: 'admin@example.com',
        password: 'hashedpassword',
        credits: 0,
        role: UserRole.ADMIN,
      });

      expect(admin.isAdmin()).toBe(true);
    });

    it('deve retornar false para usuário comum', () => {
      const user = User.create({
        email: 'user@example.com',
        password: 'hashedpassword',
        credits: 10,
        role: UserRole.USER,
      });

      expect(user.isAdmin()).toBe(false);
    });
  });
});
```

---

## 📊 Cobertura de Testes

### Configurar cobertura:

**jest.config.js:**
```javascript
module.exports = {
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.interface.ts',
    '!src/main.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Rodar com cobertura:
```bash
npm run test:cov
```

---

## 🚀 Comandos de Teste

```bash
# Todos os testes
npm test

# Modo watch
npm run test:watch

# Cobertura
npm run test:cov

# E2E
npm run test:e2e

# Teste específico
npm test user.entity.spec.ts

# Com verbose
npm test -- --verbose

# Atualizar snapshots
npm test -- -u
```

---

## 📝 Boas Práticas

1. **AAA Pattern**
   - Arrange (preparar)
   - Act (executar)
   - Assert (verificar)

2. **Nomenclatura clara**
   - `deve fazer X quando Y`
   - `deve lançar erro quando Z`

3. **Isolar testes**
   - Cada teste independente
   - Limpar dados entre testes

4. **Mock apenas o necessário**
   - Domain: sem mocks
   - Application: mock repositórios
   - Infrastructure: banco real de testes

5. **Cobertura significativa**
   - Não apenas % alto
   - Testar cenários reais

---

**Testes garantem qualidade e confiança no código!** ✅
