# API Painel - Sistema de Gestão de Créditos

API RESTful construída com NestJS seguindo Clean Architecture para gerenciamento de usuários e créditos.

> 📚 **[Ver Índice Completo de Documentação →](INDEX.md)**

## 🚀 Início Rápido

```bash
# 1. Executar setup automático
./setup.sh

# 2. Iniciar servidor
npm run start:dev
```

Pronto! API rodando em `http://localhost:3000` 🎉

**Credenciais Admin:** `admin@example.com` / `admin123456`

📖 **Guias:** [Início Rápido](QUICKSTART.md) • [Testes](TESTING_GUIDE.md) • [Arquitetura](ARCHITECTURE.md) • [Deploy](DEPLOYMENT.md)

## 🏗️ Arquitetura

O projeto segue os princípios de Clean Architecture, separando responsabilidades em camadas:

```
src/
├── domain/              # Regras de negócio puras
│   ├── entities/        # Entidades de domínio
│   ├── repositories/    # Interfaces de repositórios
│   └── exceptions/      # Exceções de domínio
├── application/         # Casos de uso
│   ├── use-cases/       # Lógica de aplicação
│   └── ports/           # Interfaces de serviços
├── infrastructure/      # Implementações técnicas
│   ├── database/        # Prisma setup
│   ├── repositories/    # Implementações de repositórios
│   └── services/        # Serviços (hash, etc)
├── interfaces/          # Camada de apresentação
│   └── http/
│       ├── controllers/ # Controllers NestJS
│       ├── dtos/        # Data Transfer Objects
│       ├── guards/      # Guards de autenticação
│       ├── strategies/  # Estratégias Passport
│       └── filters/     # Exception filters
└── modules/             # Módulos NestJS
```

## 🚀 Configuração e Instalação

### Pré-requisitos
- Node.js >= 18
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Gerar o Prisma Client
npm run prisma:generate

# Criar o banco de dados e executar migrations
npm run prisma:migrate

# Criar usuário admin inicial (opcional)
npm run prisma:seed

# Iniciar em modo desenvolvimento
npm run start:dev
```

O servidor estará rodando em `http://localhost:3000`

### Criar Primeiro Usuário Admin

Você pode criar um admin de duas formas:

**Opção 1: Usando o seed script**
```bash
npm run prisma:seed
```
Isso criará um admin com:
- Email: `admin@example.com`
- Password: `admin123456`

**Opção 2: Personalizando credenciais**
```bash
ADMIN_EMAIL="seu@email.com" ADMIN_PASSWORD="suasenha" npm run prisma:seed
```

## 📝 Endpoints

### Autenticação

#### Registrar Usuário
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "senha123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "senha123"
}
```

Resposta:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "USER"
  }
}
```

### Usuários (Autenticado)

#### Ver Meus Créditos
```http
GET /users/me/credits
Authorization: Bearer {token}
```

Resposta:
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "credits": 10,
  "role": "USER"
}
```

#### Consumir Crédito
```http
POST /users/consume-credit
Authorization: Bearer {token}
```

Resposta:
```json
{
  "remainingCredits": 9,
  "message": "Credit consumed successfully"
}
```

#### Adicionar Créditos (Apenas Admin)
```http
POST /users/add-credits
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "targetUserId": "uuid-do-usuario",
  "amount": 50
}
```

Resposta:
```json
{
  "userId": "uuid-do-usuario",
  "newCreditBalance": 60,
  "message": "Successfully added 50 credits"
}
```

## 🔐 Autenticação e Autorização

- **JWT**: Tokens JWT para autenticação
- **Guards**: 
  - `JwtAuthGuard`: Protege rotas que exigem autenticação
  - `AdminGuard`: Restringe acesso apenas a administradores

## 💾 Banco de Dados

O projeto usa SQLite com Prisma ORM. Schema:

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  credits   Int      @default(0)
  role      UserRole @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum UserRole {
  USER
  ADMIN
}
```

## 🧪 Testes

```bash
# Testes unitários
npm test

# Testes em modo watch
npm run test:watch

# Cobertura de testes
npm run test:cov
```

## 📦 Scripts Disponíveis

- `npm run start:dev` - Inicia em modo desenvolvimento com hot reload
- `npm run build` - Compila o projeto
- `npm run start:prod` - Inicia em modo produção
- `npm run prisma:studio` - Abre o Prisma Studio (GUI do banco)
- `npm run prisma:generate` - Gera o Prisma Client
- `npm run prisma:migrate` - Executa migrations

## 🔑 Variáveis de Ambiente

Crie um arquivo `.env` na raiz:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=3000
```

## 🛡️ Segurança

- Senhas criptografadas com bcrypt (10 rounds)
- Tokens JWT com expiração configurável
- Validação de DTOs com class-validator
- Guards para proteção de rotas
- Exception filters para tratamento consistente de erros

## 📚 Princípios Aplicados

- **Clean Architecture**: Separação clara de responsabilidades
- **SOLID**: Código extensível e manutenível
- **DDD**: Domínio rico e independente de frameworks
- **Dependency Injection**: Inversão de dependências
- **Repository Pattern**: Abstração de acesso a dados

## 🎯 Regras de Negócio

1. Novos usuários começam com 10 créditos
2. Apenas administradores podem adicionar créditos
3. Consumir crédito requer ter saldo positivo
4. Cada chamada ao endpoint consume 1 crédito
5. Senhas devem ter no mínimo 6 caracteres
