# 🚀 Deploy no Render (Free Tier)

## ⚠️ Importante: SQLite vs PostgreSQL

**SQLite NÃO funciona no Render Free** porque:
- Sistema de arquivos é efêmero (dados são perdidos ao reiniciar)
- Serviço hiberna após 15 min de inatividade
- Sem persistência entre deploys

**Solução:** Use PostgreSQL (gratuito no Render)

---

## 📋 Passo a Passo

### 1️⃣ Criar Conta no Render

1. Acesse [render.com](https://render.com)
2. Crie conta (pode usar GitHub)

### 2️⃣ Criar Banco PostgreSQL

1. No dashboard, clique em **New +** → **PostgreSQL**
2. Configurações:
   - **Name:** `api-painel-db`
   - **Database:** `apipainel`
   - **User:** `apiuser`
   - **Region:** escolha mais próxima
   - **Plan:** **Free**
3. Clique em **Create Database**
4. **Copie a URL de conexão** (Internal Database URL)
   - Formato: `postgresql://user:password@host/database`

### 3️⃣ Adaptar Projeto para PostgreSQL

**Editar `prisma/schema.prisma`:**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"  // ← Mudou de sqlite para postgresql
  url      = env("DATABASE_URL")
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

**Gerar nova migration:**

```bash
# Deletar migrations antigas do SQLite
rm -rf prisma/migrations

# Criar nova migration para PostgreSQL
npx prisma migrate dev --name init
```

### 4️⃣ Preparar para Deploy

**Criar `render.yaml` na raiz do projeto:**

```yaml
services:
  - type: web
    name: api-painel
    env: node
    region: oregon
    plan: free
    buildCommand: npm install && npm run prisma:generate && npm run build
    startCommand: npm run start:prod
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: api-painel-db
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: JWT_EXPIRES_IN
        value: 7d
      - key: PORT
        value: 3000

databases:
  - name: api-painel-db
    plan: free
    databaseName: apipainel
    user: apiuser
```

**Ou configurar manualmente no Render:**

### 5️⃣ Deploy Manual (sem render.yaml)

1. No Render dashboard: **New +** → **Web Service**
2. Conectar seu repositório GitHub
3. Configurações:
   - **Name:** `api-painel`
   - **Environment:** `Node`
   - **Region:** escolha próxima
   - **Branch:** `main`
   - **Build Command:**
     ```bash
     npm install && npx prisma generate && npm run build
     ```
   - **Start Command:**
     ```bash
     npx prisma migrate deploy && npm run start:prod
     ```

4. **Environment Variables:**
   ```
   DATABASE_URL = postgresql://user:password@host/database (copie do PostgreSQL)
   JWT_SECRET = seu-secret-super-forte-aqui
   JWT_EXPIRES_IN = 7d
   NODE_ENV = production
   PORT = 3000
   ```

5. Clique em **Create Web Service**

### 6️⃣ Após Deploy

**Criar usuário admin:**

Render não suporta executar scripts diretamente, então use o **Shell** no dashboard:

1. No seu serviço, clique em **Shell** (no menu lateral)
2. Execute:
   ```bash
   npm run prisma:seed
   ```

**Ou crie manualmente via Prisma Studio:**

1. Instale localmente apontando para o banco do Render:
   ```bash
   DATABASE_URL="sua-url-do-render" npx prisma studio
   ```

2. Crie o admin com senha já hasheada

---

## 🔧 Script de Migration Automática

**Adicionar em `package.json`:**

```json
{
  "scripts": {
    "start:prod": "npx prisma migrate deploy && node dist/main",
    "build:render": "npm install && npx prisma generate && npm run build"
  }
}
```

Isso aplica migrations automaticamente ao iniciar.

---

## 📊 Monitoramento no Render

- **Logs:** Acessíveis no dashboard
- **Status:** Monitora uptime
- **Hibernação:** Serviço dorme após 15min sem uso (free tier)
- **Cold Start:** Primeira requisição demora ~30s após hibernar

---

## 🌐 Domínio Customizado

Render fornece URL gratuita:
```
https://api-painel.onrender.com
```

Para domínio próprio (requer upgrade):
1. Adicione seu domínio no dashboard
2. Configure DNS (CNAME)

---

## 💡 Dicas para Render Free

### Evitar Hibernação

Use um serviço de ping (cron-job.org, UptimeRobot):
- Faça ping a cada 10 minutos
- Mantém serviço ativo

### Logs

```bash
# Ver logs em tempo real
render logs -f api-painel
```

### Variáveis de Ambiente

Nunca commite `.env` no Git. Configure no dashboard do Render.

---

## ⚡ Performance

**Render Free Tier:**
- ✅ 512 MB RAM
- ✅ 0.1 CPU compartilhado
- ✅ 750 horas/mês grátis
- ❌ Hiberna após 15min inatividade
- ❌ Cold start de ~30s

**PostgreSQL Free:**
- ✅ 256 MB RAM
- ✅ 1 GB storage
- ✅ Válido por 90 dias
- ⚠️ Dados expiram após 90 dias (faça backup!)

---

## 🔒 Segurança

### Regenerar JWT_SECRET

No Render dashboard:
1. Vá em Environment Variables
2. Clique em **Generate** para JWT_SECRET
3. Save Changes

### CORS

Se tiver frontend, adicione origem:

```typescript
// src/main.ts
app.enableCors({
  origin: 'https://seu-frontend.com',
  credentials: true,
});
```

---

## 🐛 Troubleshooting

### Build falha

**Erro:** Prisma não gera client
```bash
# Adicionar ao Build Command
npm install && npx prisma generate && npm run build
```

### Migrations não aplicadas

**Erro:** Tabelas não existem
```bash
# Adicionar ao Start Command
npx prisma migrate deploy && npm run start:prod
```

### Banco não conecta

**Erro:** Connection refused
- Verifique DATABASE_URL
- Use Internal Database URL (não External)
- Formato: `postgresql://user:pass@hostname/dbname`

### Health Check falha

Render verifica se app responde. Adicione endpoint:

```typescript
@Get()
healthCheck() {
  return { status: 'ok' };
}
```

---

## 📦 Alternativas ao Render

Se preferir outras opções free:

### Railway
- PostgreSQL gratuito
- $5 crédito grátis/mês
- Mais simples que Render

### Fly.io
- PostgreSQL gratuito
- Mais recursos free tier
- Configuração via CLI

### Vercel
- PostgreSQL via Vercel Postgres
- Excelente para Next.js
- Limitado para NestJS standalone

---

## ✅ Checklist de Deploy

- [ ] Schema Prisma atualizado para PostgreSQL
- [ ] Migrations recriadas
- [ ] PostgreSQL criado no Render
- [ ] DATABASE_URL configurada
- [ ] JWT_SECRET configurado
- [ ] Build command correto
- [ ] Start command com migrate deploy
- [ ] Deploy realizado
- [ ] Admin criado
- [ ] Endpoints testados
- [ ] CORS configurado (se necessário)

---

## 🎯 Exemplo Completo de Variáveis

```env
# No Render Dashboard
DATABASE_URL=postgresql://apiuser:abc123@dpg-xyz.oregon-postgres.render.com/apipainel
JWT_SECRET=h8f9s7d6g5h4j3k2l1m0n9b8v7c6x5z4a3s2d1f0
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=3000
```

---

## 📚 Documentação Oficial

- [Render Docs](https://render.com/docs)
- [Render PostgreSQL](https://render.com/docs/databases)
- [Prisma + PostgreSQL](https://www.prisma.io/docs/concepts/database-connectors/postgresql)

---

**Seu projeto está pronto para produção no Render!** 🚀
