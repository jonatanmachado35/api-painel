# 🎯 API de Gestão de Créditos - Sumário Executivo

## ✨ O que foi criado

Uma API REST completa em NestJS seguindo **Clean Architecture** para gerenciamento de usuários e créditos.

## 🏗️ Estrutura do Projeto

```
api-painel/
├── prisma/
│   ├── schema.prisma              # Schema do banco (SQLite)
│   ├── seed.ts                    # Script para criar admin
│   └── migrations/                # Histórico de migrations
│
├── src/
│   ├── domain/                    # Camada de Domínio (Regras de Negócio)
│   │   ├── entities/
│   │   │   └── user.entity.ts     # Entidade User com lógica de créditos
│   │   ├── repositories/
│   │   │   └── user.repository.interface.ts
│   │   └── exceptions/
│   │       └── domain.exceptions.ts
│   │
│   ├── application/               # Camada de Aplicação (Casos de Uso)
│   │   ├── use-cases/
│   │   │   ├── register-user.use-case.ts
│   │   │   ├── login.use-case.ts
│   │   │   ├── consume-credit.use-case.ts
│   │   │   ├── add-credits.use-case.ts
│   │   │   └── get-user-credits.use-case.ts
│   │   └── ports/
│   │       └── hash.service.interface.ts
│   │
│   ├── infrastructure/            # Camada de Infraestrutura
│   │   ├── database/
│   │   │   └── prisma.service.ts
│   │   ├── repositories/
│   │   │   └── prisma-user.repository.ts
│   │   └── services/
│   │       └── bcrypt-hash.service.ts
│   │
│   ├── interfaces/                # Camada de Interface (HTTP)
│   │   └── http/
│   │       ├── controllers/
│   │       │   ├── auth.controller.ts
│   │       │   └── users.controller.ts
│   │       ├── dtos/
│   │       │   ├── register.dto.ts
│   │       │   ├── login.dto.ts
│   │       │   └── add-credits.dto.ts
│   │       ├── guards/
│   │       │   ├── jwt-auth.guard.ts
│   │       │   └── admin.guard.ts
│   │       ├── strategies/
│   │       │   └── jwt.strategy.ts
│   │       └── filters/
│   │           └── domain-exception.filter.ts
│   │
│   ├── modules/
│   │   ├── auth.module.ts
│   │   └── users.module.ts
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── .env                           # Variáveis de ambiente
├── .gitignore
├── package.json
├── tsconfig.json
├── nest-cli.json
├── setup.sh                       # Script de setup automático
│
└── Documentação/
    ├── README.md                  # Documentação completa
    ├── QUICKSTART.md              # Guia rápido de início
    ├── ARCHITECTURE.md            # Explicação da arquitetura
    ├── COMMANDS.md                # Comandos úteis
    └── api-examples.http          # Exemplos de requisições
```

## 🔐 Funcionalidades Implementadas

### Autenticação
- ✅ Registro de usuários com validação
- ✅ Login com JWT
- ✅ Password hash com bcrypt
- ✅ Guards de autenticação e autorização

### Gestão de Créditos
- ✅ Usuários novos recebem 10 créditos
- ✅ Endpoint para consumir 1 crédito
- ✅ Endpoint para verificar saldo
- ✅ Endpoint admin para adicionar créditos
- ✅ Validações de saldo insuficiente

### Autorização
- ✅ Usuários comuns: podem apenas consumir
- ✅ Admins: podem adicionar créditos
- ✅ Guards para proteger rotas admin

## 📡 Endpoints Disponíveis

### Públicos
```
POST   /auth/register     # Registrar novo usuário
POST   /auth/login        # Fazer login
```

### Autenticados (requer token)
```
GET    /users/me/credits     # Ver seus créditos
POST   /users/consume-credit # Consumir 1 crédito
```

### Admin (requer token de admin)
```
POST   /users/add-credits    # Adicionar créditos a usuário
```

## 🚀 Como Usar

### Opção 1: Setup Automático
```bash
./setup.sh
npm run start:dev
```

### Opção 2: Manual
```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

## 🔑 Credenciais Admin Padrão

```
Email: admin@example.com
Senha: admin123456
```

## 🎯 Princípios Aplicados

- ✅ **Clean Architecture** - Separação de camadas
- ✅ **SOLID** - Todos os 5 princípios
- ✅ **DDD** - Domain-Driven Design
- ✅ **Dependency Injection** - Inversão de controle
- ✅ **Repository Pattern** - Abstração de dados
- ✅ **Use Cases** - Lógica de aplicação isolada
- ✅ **Rich Domain Model** - Entidades com comportamento

## 🧪 Testabilidade

- ✅ Use cases puros (fácil de testar)
- ✅ Mocks de repositórios
- ✅ Exemplo de teste unitário incluído
- ✅ Separação permite testes isolados

## 📊 Tecnologias

- **NestJS** - Framework backend
- **Prisma** - ORM
- **SQLite** - Banco de dados
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas
- **TypeScript** - Tipagem estática
- **Class Validator** - Validação de DTOs
- **Passport** - Estratégias de auth

## 🎨 Decisões Arquiteturais

1. **Clean Architecture**: Facilita manutenção e testes
2. **SQLite**: Simples para começar, fácil migrar depois
3. **Prisma**: Type-safe, migrations automáticas
4. **JWT**: Stateless, escalável
5. **Use Cases**: Cada funcionalidade isolada
6. **Guards**: Segurança em camadas
7. **DTOs**: Validação automática de entrada

## 📈 Próximos Passos Sugeridos

1. Adicionar testes E2E
2. Implementar refresh tokens
3. Adicionar rate limiting
4. Criar logs estruturados
5. Implementar auditoria
6. Adicionar paginação
7. Criar dashboard admin
8. Implementar email notifications
9. Adicionar webhook de créditos baixos
10. Dockerizar aplicação

## 📝 Notas Importantes

- Créditos iniciais: **10 por usuário**
- Apenas **admins** adicionam créditos
- Consumir sem saldo: **HTTP 402**
- Tokens expiram em **7 dias**
- Senhas mínimo **6 caracteres**

## 🔒 Segurança

- ✅ Senhas hasheadas
- ✅ JWT com secret configurável
- ✅ Validação de inputs
- ✅ Guards de autorização
- ✅ Exceptions tratadas
- ✅ CORS habilitado

---

**Desenvolvido seguindo as melhores práticas de arquitetura de software** 🚀
