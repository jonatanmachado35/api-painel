# 🔄 Migração SQLite → PostgreSQL (Supabase)

## ⚡ Guia Rápido

### 1. Configure Supabase

```bash
# 1. Criar projeto em https://supabase.com
# 2. Copiar connection strings
# 3. Atualizar .env
```

### 2. Atualizar Configuração

Já feito! Verifique:
- ✅ `prisma/schema.prisma` → provider = "postgresql"
- ✅ `.env` → DATABASE_URL + DIRECT_URL

### 3. Recriar Migrations

```bash
# Deletar migrations antigas
rm -rf prisma/migrations

# Gerar client
npx prisma generate

# Criar nova migration
npx prisma migrate dev --name init

# Criar admin
npm run prisma:seed
```

### 4. Testar

```bash
# Iniciar servidor
npm run start:dev

# Testar registro
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@example.com","password":"senha123"}'
```

---

## 📝 Variáveis de Ambiente

Atualize seu `.env` com credenciais do Supabase:

```env
# Connection Pooling (usar em produção)
DATABASE_URL="postgresql://postgres.[ref]:[SUA-SENHA]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct Connection (usar para migrations)
DIRECT_URL="postgresql://postgres:[SUA-SENHA]@db.xxx.supabase.co:5432/postgres"

JWT_SECRET="seu-secret-aqui"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
PORT=3000
```

**Como obter as URLs:**

1. Supabase Dashboard → Settings → Database
2. **Connection Pooling** (porta 6543) → copiar para `DATABASE_URL`
3. **Direct Connection** (porta 5432) → copiar para `DIRECT_URL`

---

## 🎯 Checklist

- [ ] Projeto criado no Supabase
- [ ] Connection strings copiadas
- [ ] `.env` atualizado
- [ ] `schema.prisma` atualizado (provider = "postgresql")
- [ ] Migrations antigas deletadas
- [ ] `npx prisma generate` executado
- [ ] `npx prisma migrate dev` executado
- [ ] Admin criado com `npm run prisma:seed`
- [ ] Servidor iniciado e testado
- [ ] Dados verificados no Supabase Table Editor

---

## 🐛 Problemas Comuns

### "Can't reach database server"

Verifique:
- Senha na URL está correta
- Copiou a URL completa (com senha substituída)
- Projeto Supabase está ativo

### "Prisma Client not found"

```bash
npx prisma generate
npm install
```

### Migrations não aplicam

```bash
# Aplicar manualmente
npx prisma migrate deploy
```

### Admin não cria

```bash
# Criar manualmente via Supabase SQL Editor
# Ou via Prisma Studio
DATABASE_URL="sua-url" npx prisma studio
```

---

**Pronto! Agora você está usando PostgreSQL com Supabase** ✅
