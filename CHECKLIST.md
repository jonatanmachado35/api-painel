# ✅ Checklist de Validação do Projeto

Use este checklist para validar que tudo está funcionando corretamente.

## 📦 Instalação e Configuração

- [ ] Node.js >= 18 instalado
- [ ] Dependências instaladas (`npm install`)
- [ ] Prisma Client gerado (`npm run prisma:generate`)
- [ ] Banco de dados criado (`npm run prisma:migrate`)
- [ ] Arquivo `.env` configurado
- [ ] Usuário admin criado (`npm run prisma:seed`)

## 🚀 Servidor

- [ ] Servidor inicia sem erros (`npm run start:dev`)
- [ ] Servidor responde em `http://localhost:3000`
- [ ] Logs aparecem no terminal
- [ ] Hot reload funciona ao editar arquivos

## 🔐 Autenticação

- [ ] Registrar novo usuário funciona (POST /auth/register)
- [ ] Email duplicado retorna erro 409
- [ ] Senha curta (< 6 chars) retorna erro 400
- [ ] Email inválido retorna erro 400
- [ ] Login com credenciais corretas retorna token
- [ ] Login com senha errada retorna 401
- [ ] Login com email inexistente retorna 401
- [ ] Token JWT é retornado corretamente

## 👤 Usuário Comum

- [ ] Ver créditos sem token retorna 401
- [ ] Ver créditos com token funciona (GET /users/me/credits)
- [ ] Novo usuário tem 10 créditos
- [ ] Consumir crédito funciona (POST /users/consume-credit)
- [ ] Créditos diminuem a cada consumo
- [ ] Consumir sem saldo retorna 402
- [ ] Tentar adicionar créditos retorna 401 (não é admin)

## 👑 Admin

- [ ] Login como admin funciona
- [ ] Admin pode adicionar créditos (POST /users/add-credits)
- [ ] Créditos são adicionados corretamente
- [ ] Adicionar valor negativo retorna erro
- [ ] Adicionar a usuário inexistente retorna erro

## 🗄️ Banco de Dados

- [ ] Prisma Studio abre (`npm run prisma:studio`)
- [ ] Tabela `users` existe
- [ ] Usuário admin aparece no banco
- [ ] Créditos são persistidos corretamente
- [ ] Role (USER/ADMIN) está correto
- [ ] Senhas estão hasheadas (não aparecem em texto plano)

## 📝 Validações

- [ ] Email deve ser válido
- [ ] Senha mínimo 6 caracteres
- [ ] Campos obrigatórios não podem ser vazios
- [ ] Amount de créditos deve ser positivo
- [ ] Erros retornam mensagens claras

## 🧪 Testes

- [ ] Testes unitários passam (`npm test`)
- [ ] Exemplo de teste existe (consume-credit.use-case.spec.ts)
- [ ] Testes podem ser executados em watch mode

## 📚 Documentação

- [ ] README.md existe e está completo
- [ ] QUICKSTART.md tem instruções claras
- [ ] ARCHITECTURE.md explica a estrutura
- [ ] TESTING_GUIDE.md tem exemplos de testes
- [ ] INDEX.md lista toda documentação
- [ ] api-examples.http tem exemplos de requisições
- [ ] postman-collection.json pode ser importado

## 🛠️ Scripts

- [ ] `npm run start:dev` funciona
- [ ] `npm run build` compila sem erros
- [ ] `npm run prisma:studio` abre GUI
- [ ] `npm run prisma:seed` cria admin
- [ ] `npm test` executa testes
- [ ] `./setup.sh` funciona (se no Linux/Mac)

## 🏗️ Arquitetura

- [ ] Camada Domain está isolada (sem dependências externas)
- [ ] Use cases usam interfaces (IUserRepository, IHashService)
- [ ] Controllers não têm lógica de negócio
- [ ] Repositórios implementam interfaces
- [ ] Guards protegem rotas corretamente
- [ ] Exception filter captura erros de domínio

## 🔒 Segurança

- [ ] Senhas são hasheadas com bcrypt
- [ ] JWT_SECRET está configurado
- [ ] Tokens expiram conforme configurado
- [ ] CORS está habilitado
- [ ] Validation pipe está global
- [ ] Guards impedem acesso não autorizado

## 📊 Funcionalidades

- [ ] Registrar usuário
- [ ] Login com JWT
- [ ] Ver saldo de créditos
- [ ] Consumir 1 crédito
- [ ] Admin adicionar créditos
- [ ] Validação de saldo insuficiente
- [ ] Validação de permissões (admin only)

## 🎯 Regras de Negócio

- [ ] Novos usuários começam com 10 créditos
- [ ] Consumir diminui 1 crédito
- [ ] Não pode consumir sem saldo
- [ ] Apenas admin adiciona créditos
- [ ] Role persiste corretamente (USER/ADMIN)

## 📁 Estrutura de Pastas

- [ ] `src/domain/` existe
- [ ] `src/application/` existe
- [ ] `src/infrastructure/` existe
- [ ] `src/interfaces/` existe
- [ ] `src/modules/` existe
- [ ] `prisma/` existe com schema e migrations

## 🐛 Tratamento de Erros

- [ ] UserNotFoundException retorna 404
- [ ] UserAlreadyExistsException retorna 409
- [ ] UnauthorizedException retorna 401
- [ ] InsufficientCreditsException retorna 402
- [ ] Validation errors retornam 400
- [ ] Mensagens de erro são claras

---

## 📊 Resultado

Total de itens: **~90**

Checkados: **____**

Porcentagem: **____%**

---

## 🎉 Critérios de Sucesso

✅ **Mínimo:** 70% dos itens checkados  
🎯 **Bom:** 85% dos itens checkados  
🌟 **Excelente:** 95%+ dos itens checkados

---

## 🐛 Problemas Comuns

### Servidor não inicia
```bash
# Verificar se porta 3000 está livre
lsof -ti:3000 | xargs kill -9

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### Prisma não funciona
```bash
# Regenerar client
npm run prisma:generate

# Recriar banco
npx prisma migrate reset
npm run prisma:migrate
```

### Testes falham
```bash
# Limpar cache
npm run test -- --clearCache

# Rodar novamente
npm test
```

---

**Data de validação:** _______________  
**Validado por:** _______________  
**Status:** [ ] Aprovado  [ ] Com pendências  [ ] Reprovado

---

## 📝 Notas Adicionais

_Espaço para anotações sobre problemas encontrados ou melhorias sugeridas:_

