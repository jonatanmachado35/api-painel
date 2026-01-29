# 🔐 Sistema de Sessão Única

## Visão Geral

A API implementa um **sistema de sessão única** que garante que apenas um login esteja ativo por usuário por vez.

## Como Funciona

### Arquitetura

1. **Camada de Domínio**
   - User Entity possui propriedade `currentSessionToken` opcional
   - Método `updateSessionToken()` atualiza a sessão e `updatedAt`

2. **Camada de Aplicação**
   - `LoginUseCase` recebe o token JWT gerado
   - Salva o token no banco de dados usando `user.updateSessionToken()`
   - Invalida automaticamente qualquer sessão anterior

3. **Camada de Infraestrutura**
   - Prisma schema: campo `currentSessionToken String?`
   - Migration adiciona coluna ao banco PostgreSQL

4. **Camada de Interface**
   - `SessionGuard`: Valida se o token usado ainda é o ativo
   - `AuthController`: Gera token e passa para o LoginUseCase

## Fluxo de Validação

### Login (Criação de Sessão)

```
POST /auth/login
├─> AuthController gera token temporário
├─> LoginUseCase valida credenciais
├─> user.updateSessionToken(token) salva no banco
├─> Retorna access_token para o cliente
└─> Sessões anteriores são invalidadas
```

### Requisição Protegida

```
GET /users/me/credits
├─> JwtAuthGuard: Valida JWT e extrai userId
├─> SessionGuard: Verifica no banco
│   ├─> Busca user.currentSessionToken
│   ├─> Compara com token do header
│   └─> Se diferente: 401 "Session invalidated"
└─> Se válido: continua para o controller
```

## Comportamento

### Cenário 1: Login Único
```bash
# Usuário faz login no dispositivo A
POST /auth/login → token_A
# Salvo no banco: currentSessionToken = token_A

# Requisições com token_A funcionam ✅
GET /users/me/credits (Authorization: Bearer token_A) → 200 OK
```

### Cenário 2: Login Simultâneo
```bash
# Dispositivo A já logado com token_A
currentSessionToken = token_A

# Usuário faz login no dispositivo B
POST /auth/login → token_B
# Banco atualiza: currentSessionToken = token_B

# Dispositivo A tenta usar token_A
GET /users/me/credits (Authorization: Bearer token_A)
→ 401 Unauthorized
→ "Session invalidated. Another login detected for this account."

# Dispositivo B funciona normalmente ✅
GET /users/me/credits (Authorization: Bearer token_B) → 200 OK
```

## Guards Aplicados

### UsersController
```typescript
@UseGuards(JwtAuthGuard, SessionGuard)
```

**Ordem de execução:**
1. `JwtAuthGuard`: Verifica assinatura JWT e extrai payload
2. `SessionGuard`: Valida se token ainda é o ativo no banco

## Código Principais

### SessionGuard
```typescript
async canActivate(context: ExecutionContext): Promise<boolean> {
  const userId = request.user?.userId;
  const currentToken = authHeader.substring(7); // Extrai Bearer token
  
  const user = await this.userRepository.findById(userId);
  
  // Compara token do request com token salvo
  if (user.currentSessionToken !== currentToken) {
    throw new UnauthorizedException(
      'Session invalidated. Another login detected for this account.'
    );
  }
  
  return true;
}
```

### LoginUseCase
```typescript
async execute(input: LoginInput): Promise<LoginOutput> {
  // ... validação de credenciais
  
  // Atualiza sessão no banco
  user.updateSessionToken(input.sessionToken);
  await this.userRepository.update(user);
  
  return { userId, email, role };
}
```

## Vantagens

✅ **Segurança**: Impede uso de tokens roubados após novo login  
✅ **Clean Architecture**: Regra de negócio isolada no domínio  
✅ **Performance**: Uma query extra apenas em endpoints protegidos  
✅ **Rastreabilidade**: Histórico de `updatedAt` mostra último login

## Mensagens de Erro

| Código | Mensagem | Situação |
|--------|----------|----------|
| 401 | Session invalidated. Another login detected for this account. | Token válido mas não é mais o ativo |
| 401 | No token provided | Header Authorization ausente |
| 401 | User not found | UserId do JWT não existe no banco |

## Testando

### 1. Login em dois lugares
```bash
# Terminal 1
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "senha123"}'
# Salva TOKEN_1

# Terminal 2
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "senha123"}'
# Salva TOKEN_2

# Terminal 1 (token antigo)
curl http://localhost:3000/users/me/credits \
  -H "Authorization: Bearer TOKEN_1"
# ❌ 401: Session invalidated

# Terminal 2 (token novo)
curl http://localhost:3000/users/me/credits \
  -H "Authorization: Bearer TOKEN_2"
# ✅ 200: Funciona
```

## Considerações

### Performance
- Uma query adicional por requisição protegida: `findById(userId)`
- Pode ser otimizada com cache (Redis) se necessário
- Trade-off: Segurança vs Latência (~10-50ms)

### Escalabilidade
- Banco de dados já armazena o token
- Stateless: Não precisa de sessão em memória
- Funciona em múltiplas instâncias da API

### Logout
Para implementar logout explícito:
```typescript
user.updateSessionToken(null);
await userRepository.update(user);
```

## Extensões Futuras

- [ ] Armazenar histórico de logins com timestamps
- [ ] Suportar múltiplas sessões com limite (ex: 3 dispositivos)
- [ ] Notificar usuário por email ao detectar novo login
- [ ] Cache de tokens ativos com Redis para performance
- [ ] Expiração automática de tokens inativos (TTL)
