# 🧪 Guia de Testes da API

## 📋 Pré-requisitos

Antes de começar, certifique-se de:

1. ✅ Ter rodado `./setup.sh` ou seguido os passos manuais
2. ✅ O servidor estar rodando em `http://localhost:3000`
3. ✅ Ter uma ferramenta para fazer requisições HTTP (curl, Postman, Insomnia, Thunder Client)

## 🎬 Fluxo Completo de Teste

### 1️⃣ Registrar um Novo Usuário

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

**Resposta esperada (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid-gerado",
    "email": "joao@example.com",
    "credits": 10,
    "role": "USER"
  }
}
```

✅ **Validações automáticas:**
- Email válido
- Senha mínimo 6 caracteres
- Email único (não pode duplicar)

---

### 2️⃣ Fazer Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

**Resposta esperada (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ...",
  "user": {
    "id": "uuid-do-usuario",
    "email": "joao@example.com",
    "role": "USER"
  }
}
```

🔑 **Copie o `access_token`!** Você vai precisar dele para as próximas requisições.

---

### 3️⃣ Ver Seus Créditos

```bash
curl -X GET http://localhost:3000/users/me/credits \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta esperada (200):**
```json
{
  "userId": "uuid-do-usuario",
  "email": "joao@example.com",
  "credits": 10,
  "role": "USER"
}
```

---

### 4️⃣ Consumir 1 Crédito

```bash
curl -X POST http://localhost:3000/users/consume-credit \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta esperada (201):**
```json
{
  "remainingCredits": 9,
  "message": "Credit consumed successfully"
}
```

💡 **Teste múltiplas vezes!** A cada chamada, os créditos diminuem.

---

### 5️⃣ Tentar Consumir Sem Créditos

Chame o endpoint 10 vezes até zerar os créditos, então:

```bash
curl -X POST http://localhost:3000/users/consume-credit \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta esperada (402 Payment Required):**
```json
{
  "statusCode": 402,
  "message": "Insufficient credits",
  "error": "InsufficientCreditsException"
}
```

---

### 6️⃣ Login como Admin

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123456"
  }'
```

**Resposta esperada (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5...",
  "user": {
    "id": "uuid-do-admin",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}
```

🔑 **Copie o token do admin!**

---

### 7️⃣ Admin Adiciona Créditos

Primeiro, pegue o `userId` do João (foi retornado no passo 1 ou 3).

```bash
curl -X POST http://localhost:3000/users/add-credits \
  -H "Authorization: Bearer TOKEN_DO_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "targetUserId": "uuid-do-joao",
    "amount": 50
  }'
```

**Resposta esperada (201):**
```json
{
  "userId": "uuid-do-joao",
  "newCreditBalance": 50,
  "message": "Successfully added 50 credits"
}
```

---

### 8️⃣ Usuário Comum Tenta Adicionar Créditos

```bash
curl -X POST http://localhost:3000/users/add-credits \
  -H "Authorization: Bearer TOKEN_DO_USUARIO" \
  -H "Content-Type: application/json" \
  -d '{
    "targetUserId": "qualquer-id",
    "amount": 100
  }'
```

**Resposta esperada (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "UnauthorizedException"
}
```

🛡️ **Guard funcionando!** Apenas admins podem adicionar.

---

### 9️⃣ Verificar Créditos Atualizados

```bash
curl -X GET http://localhost:3000/users/me/credits \
  -H "Authorization: Bearer TOKEN_DO_JOAO"
```

**Resposta esperada (200):**
```json
{
  "userId": "uuid-do-joao",
  "email": "joao@example.com",
  "credits": 50,
  "role": "USER"
}
```

✅ **Os 50 créditos foram adicionados!**

---

## 🧪 Casos de Teste Importantes

### ✅ Casos de Sucesso

| Teste | Endpoint | Resultado Esperado |
|-------|----------|-------------------|
| Registrar usuário válido | POST /auth/register | 201 - Usuário criado com 10 créditos |
| Login com credenciais corretas | POST /auth/login | 200 - Token JWT retornado |
| Ver créditos autenticado | GET /users/me/credits | 200 - Saldo correto |
| Consumir com saldo | POST /users/consume-credit | 201 - Crédito consumido |
| Admin adiciona créditos | POST /users/add-credits | 201 - Créditos adicionados |

### ❌ Casos de Erro

| Teste | Cenário | Código | Mensagem |
|-------|---------|--------|----------|
| Registro duplicado | Email já existe | 409 | User already exists |
| Login inválido | Senha errada | 401 | Unauthorized |
| Sem autenticação | Token ausente | 401 | Unauthorized |
| Créditos insuficientes | Saldo = 0 | 402 | Insufficient credits |
| Usuário não admin | USER tenta adicionar | 401 | Unauthorized |
| Validação falha | Senha < 6 chars | 400 | Validation error |

---

## 🔍 Debugging com Prisma Studio

Abra a GUI do banco de dados:

```bash
npm run prisma:studio
```

Acesse: `http://localhost:5555`

Você pode:
- ✅ Ver todos os usuários
- ✅ Verificar créditos em tempo real
- ✅ Editar dados manualmente
- ✅ Resetar créditos para testes

---

## 📊 Monitoramento em Tempo Real

### Ver logs do servidor

```bash
# Os logs aparecem automaticamente ao rodar:
npm run start:dev
```

Você verá:
```
[Nest] 12345  - 28/01/2026, 10:30:45   LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 28/01/2026, 10:30:45   LOG [InstanceLoader] AppModule dependencies initialized
🚀 Application is running on: http://localhost:3000
```

---

## 🎯 Checklist Completo de Testes

- [ ] Registrar usuário novo
- [ ] Tentar registrar email duplicado (deve falhar)
- [ ] Login com credenciais corretas
- [ ] Login com senha errada (deve falhar)
- [ ] Ver créditos sem token (deve falhar)
- [ ] Ver créditos com token válido
- [ ] Consumir 1 crédito
- [ ] Consumir todos os créditos
- [ ] Tentar consumir sem saldo (deve falhar)
- [ ] Login como admin
- [ ] Admin adiciona créditos
- [ ] Usuário comum tenta adicionar (deve falhar)
- [ ] Verificar créditos após adição
- [ ] Testar validação de email inválido
- [ ] Testar validação de senha curta

---

## 💡 Dicas de Teste

1. **Use variáveis de ambiente** no Postman/Insomnia para tokens
2. **Salve os IDs** retornados para usar em outras requisições
3. **Teste edge cases**: valores negativos, strings vazias, etc.
4. **Verifique os logs** do servidor para debugar
5. **Use Prisma Studio** para ver o estado do banco

---

## 🐛 Troubleshooting

### Token expirado
```bash
# Faça login novamente
curl -X POST http://localhost:3000/auth/login ...
```

### Servidor não responde
```bash
# Verifique se está rodando
curl http://localhost:3000
```

### Resetar dados de teste
```bash
npx prisma migrate reset
npm run prisma:seed
```

---

**Pronto para testar!** 🚀

Use o arquivo `api-examples.http` se estiver usando VS Code com a extensão REST Client.
