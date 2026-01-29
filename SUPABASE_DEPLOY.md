# 🚀 Deploy com Supabase + Render/Vercel

## 🎯 Arquitetura

- **Banco de Dados:** Supabase (PostgreSQL gratuito)
- **Backend API:** Render/Vercel/Railway (sua escolha)

**Vantagens do Supabase:**
- ✅ PostgreSQL gratuito 500MB
- ✅ Sem expiração (ao contrário do Render)
- ✅ Dashboard visual excelente
- ✅ Conexões ilimitadas
- ✅ Backups automáticos
- ✅ API REST auto-gerada
- ✅ Real-time subscriptions (se precisar no futuro)

---

## 📋 Passo 1: Configurar Supabase

### 1.1 Criar Projeto

1. Acesse [supabase.com](https://supabase.com)
2. Crie conta (pode usar GitHub)
3. Clique em **New Project**
4. Configure:
   - **Name:** `api-painel`
   - **Database Password:** crie uma senha forte (copie!)
   - **Region:** escolha mais próxima (South America se disponível)
   - **Pricing Plan:** **Free**
5. Aguarde ~2 minutos enquanto provisiona

### 1.2 Obter String de Conexão

1. No projeto, vá em **Settings** (ícone de engrenagem)
2. Clique em **Database**
3. Em **Connection String**, escolha **URI**
4. Copie a connection string:
   ```
   postgresql://postgres:[SUA-SENHA]@db.xxx.supabase.co:5432/postgres
   ```
5. Substitua `[SUA-SENHA]` pela senha que você criou

**Importante:** Use **Connection pooling** para melhor performance:
- Vá em **Database** → **Connection pooling**
- Copie a **Connection string** (porta 6543):
  ```
  postgresql://postgres.[ref]:[senha]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
  ```

---

## 📋 Passo 2: Adaptar Projeto

### 2.1 Atualizar Schema Prisma

Editar `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"  // ← Mudou de sqlite
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")  // ← Adicionar para migrations
}

enum UserRole {
  USER
  ADMIN
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  credits   Int      @default(0)
  role      UserRole @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

### 2.2 Atualizar .env

```env
# Supabase Connection Pooling (para produção)
DATABASE_URL="postgresql://postgres.[ref]:[senha]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Supabase Direct Connection (para migrations)
DIRECT_URL="postgresql://postgres:[senha]@db.xxx.supabase.co:5432/postgres"

# Outras variáveis
JWT_SECRET="seu-secret-super-forte-aqui"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
PORT=3000
```

### 2.3 Recriar Migrations

```bash
# Deletar migrations antigas do SQLite
rm -rf prisma/migrations

# Gerar Prisma Client
npx prisma generate

# Criar e aplicar migration
npx prisma migrate dev --name init
```

Isso criará as tabelas no Supabase!

### 2.4 Criar Admin

```bash
npm run prisma:seed
```

---

## 📋 Passo 3: Deploy do Backend

### Opção A: Render (Recomendado)

#### 3.1 Configurar no Render

1. Acesse [render.com](https://render.com)
2. **New +** → **Web Service**
3. Conecte seu repositório GitHub
4. Configure:
   - **Name:** `api-painel`
   - **Environment:** `Node`
   - **Build Command:**
     ```bash
     npm install && npx prisma generate && npm run build
     ```
   - **Start Command:**
     ```bash
     npx prisma migrate deploy && npm run start:prod
     ```

#### 3.2 Variáveis de Ambiente

```
DATABASE_URL=postgresql://postgres.[ref]:[senha]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:[senha]@db.xxx.supabase.co:5432/postgres
JWT_SECRET=gere-um-secret-forte-aleatorio
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=3000
```

#### 3.3 Deploy

Clique em **Create Web Service**

### Opção B: Vercel

#### 3.1 Instalar Vercel CLI

```bash
npm i -g vercel
```

#### 3.2 Criar vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/main.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/main.js"
    }
  ],
  "env": {
    "DATABASE_URL": "@database-url",
    "DIRECT_URL": "@direct-url",
    "JWT_SECRET": "@jwt-secret"
  }
}
```

#### 3.3 Deploy

```bash
# Build local
npm run build

# Deploy
vercel --prod

# Adicionar variáveis (no dashboard ou CLI)
vercel env add DATABASE_URL
vercel env add DIRECT_URL
vercel env add JWT_SECRET
```

### Opção C: Railway

1. Acesse [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub**
3. Configure variáveis de ambiente
4. Deploy automático

---

## 📋 Passo 4: Verificar Deploy

### 4.1 Testar API

```bash
# Sua URL do Render/Vercel
curl https://api-painel.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "senha123"
  }'
```

### 4.2 Verificar Banco no Supabase

1. No Supabase dashboard, clique em **Table Editor**
2. Você verá a tabela `users`
3. Confira se o usuário foi criado

### 4.3 Criar Admin via Supabase

Se precisar criar admin manualmente:

1. No Supabase, vá em **SQL Editor**
2. Execute:

```sql
-- Criar admin (senha já hasheada com bcrypt)
INSERT INTO users (id, email, password, credits, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@example.com',
  '$2b$10$xyz...',  -- hash bcrypt da senha 'admin123456'
  0,
  'ADMIN',
  NOW(),
  NOW()
);
```

Ou use Prisma Studio localmente:

```bash
DATABASE_URL="sua-url-supabase" npx prisma studio
```

---

## 🎯 Monitoramento

### Supabase Dashboard

- **Database:** Ver tabelas e dados
- **SQL Editor:** Executar queries
- **Logs:** Ver logs do PostgreSQL
- **Reports:** Uso de recursos

### Render Dashboard

- **Logs:** Ver logs da aplicação
- **Metrics:** CPU, memória, requisições
- **Shell:** Terminal remoto

---

## 📊 Limites do Tier Gratuito

### Supabase Free

- ✅ 500 MB database
- ✅ 1 GB file storage
- ✅ 2 GB bandwidth/mês
- ✅ 50 MB file uploads
- ✅ Sem limite de tempo
- ✅ 2 projetos gratuitos

### Render Free

- ✅ 512 MB RAM
- ✅ Hibernação após 15min
- ✅ 750 horas/mês
- ❌ Cold start (~30s)

---

## 🔧 Otimizações

### Connection Pooling

Já configurado com `pgbouncer=true` na URL.

### Prevenir Hibernação (Render)

Use cron-job.org ou UptimeRobot para ping:
- URL: `https://api-painel.onrender.com`
- Intervalo: 10 minutos

### Logs Estruturados

```typescript
// src/main.ts
import { Logger } from '@nestjs/common';

const logger = new Logger('Bootstrap');
logger.log(`Server running on ${await app.getUrl()}`);
```

---

## 🔒 Segurança

### Row Level Security (RLS)

Supabase suporta RLS, mas como você usa Prisma, não precisa ativar.

### SSL

Supabase já usa SSL. Certifique-se de ter `?sslmode=require` na URL se necessário.

### Secrets

Nunca commite:
- `.env`
- Senhas do Supabase
- JWT_SECRET

---

## 🐛 Troubleshooting

### Erro: "Can't reach database server"

- Verifique se IP está permitido no Supabase (deve estar aberto)
- Confirme senha na connection string

### Migrations não aplicam

```bash
# Localmente
npx prisma migrate deploy

# No Render, verifique Start Command
npx prisma migrate deploy && npm run start:prod
```

### Prisma Client desatualizado

```bash
# Após alterar schema
npx prisma generate
npm run build
```

---

## 📚 Próximos Passos

### Backups

Supabase faz backup automático. Para backup manual:

```bash
# No Supabase dashboard: Database → Backups
```

### Monitoramento

Adicione APM:
- Sentry (erros)
- LogRocket (session replay)
- Datadog (métricas)

### Escalabilidade

Quando crescer:
- Supabase Pro: $25/mês
- Render Standard: $7/mês
- Cache com Redis

---

## ✅ Checklist

- [ ] Projeto criado no Supabase
- [ ] Connection strings copiadas
- [ ] Schema atualizado para PostgreSQL
- [ ] Migrations recriadas e aplicadas
- [ ] Admin criado no banco
- [ ] Backend deployado (Render/Vercel)
- [ ] Variáveis de ambiente configuradas
- [ ] Endpoints testados
- [ ] CORS configurado (se necessário)

---

**Seu projeto está rodando com Supabase!** 🚀

URLs:
- **API:** https://api-painel.onrender.com
- **Supabase:** https://app.supabase.com/project/[seu-projeto]
