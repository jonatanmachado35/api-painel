# 🚀 Guia Rápido de Início

## 1️⃣ Instalar Dependências
```bash
npm install
```

## 2️⃣ Configurar Banco de Dados
```bash
# Gerar Prisma Client
npm run prisma:generate

# Aplicar migrations
npm run prisma:migrate
```

## 3️⃣ Criar Usuário Admin
```bash
npm run prisma:seed
```

Credenciais padrão:
- **Email**: `admin@example.com`
- **Senha**: `admin123456`

## 4️⃣ Iniciar o Servidor
```bash
npm run start:dev
```

Servidor rodando em: `http://localhost:3000`

## 5️⃣ Testar os Endpoints

### Registrar um Usuário
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "senha123"
  }'
```

### Fazer Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "senha123"
  }'
```

Você receberá um `access_token`. Use-o nas próximas requisições.

### Ver Seus Créditos
```bash
curl -X GET http://localhost:3000/users/me/credits \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Consumir 1 Crédito
```bash
curl -X POST http://localhost:3000/users/consume-credit \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Adicionar Créditos (apenas admin)
```bash
# Primeiro, faça login como admin para obter o token

curl -X POST http://localhost:3000/users/add-credits \
  -H "Authorization: Bearer TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "targetUserId": "uuid-do-usuario",
    "amount": 50
  }'
```

## 🔍 Ferramentas Úteis

### Prisma Studio (GUI do Banco)
```bash
npm run prisma:studio
```

Abre em: `http://localhost:5555`

### Ver Logs em Desenvolvimento
O servidor já roda com hot-reload. Basta salvar os arquivos.

## 📝 Próximos Passos

1. Altere o `JWT_SECRET` no arquivo `.env`
2. Configure variáveis de ambiente para produção
3. Adicione mais validações conforme necessário
4. Implemente testes E2E
5. Configure CI/CD

## ⚠️ Lembretes

- Novos usuários começam com **10 créditos**
- Apenas **admins** podem adicionar créditos
- Consumir crédito sem saldo retorna erro **402 Payment Required**
