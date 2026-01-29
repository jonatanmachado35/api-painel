# 📋 Comandos Úteis

## Desenvolvimento

```bash
# Iniciar em modo desenvolvimento (hot reload)
npm run start:dev

# Iniciar em modo debug
npm run start:debug

# Build para produção
npm run build

# Iniciar produção
npm run start:prod
```

## Banco de Dados

```bash
# Gerar Prisma Client (após alterar schema.prisma)
npm run prisma:generate

# Criar uma nova migration
npm run prisma:migrate

# Aplicar migrations em produção
npx prisma migrate deploy

# Abrir Prisma Studio (GUI do banco)
npm run prisma:studio

# Resetar banco de dados (CUIDADO!)
npx prisma migrate reset

# Criar usuário admin
npm run prisma:seed

# Ver status das migrations
npx prisma migrate status
```

## Testes

```bash
# Rodar todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Testes com cobertura
npm run test:cov

# Testes E2E
npm run test:e2e
```

## Code Quality

```bash
# Formatar código
npm run format

# Lint (verificar erros)
npm run lint

# Lint e corrigir automaticamente
npm run lint -- --fix
```

## Prisma - Comandos Avançados

```bash
# Ver modelo de dados do schema
npx prisma format

# Validar o schema
npx prisma validate

# Fazer pull do schema do banco existente
npx prisma db pull

# Sincronizar schema sem criar migration
npx prisma db push

# Gerar diagrama ER (requer extensão)
npx prisma-erd-generator
```

## Docker (Opcional)

Se quiser rodar em container:

```bash
# Build da imagem
docker build -t api-painel .

# Rodar container
docker run -p 3000:3000 api-painel
```

## Deploy

### Preparar para produção

```bash
# 1. Build
npm run build

# 2. Gerar Prisma Client
npm run prisma:generate

# 3. Aplicar migrations
npx prisma migrate deploy

# 4. Criar admin (se necessário)
npm run prisma:seed

# 5. Iniciar
npm run start:prod
```

## Troubleshooting

### Prisma não encontrado
```bash
npm install prisma @prisma/client
npm run prisma:generate
```

### Erro de migration
```bash
npx prisma migrate reset
npm run prisma:migrate
```

### Limpar node_modules
```bash
rm -rf node_modules package-lock.json
npm install
```

### Verificar variáveis de ambiente
```bash
cat .env
```

## Monitoramento

### Ver logs em produção (PM2)
```bash
pm2 logs api-painel
```

### Ver status (PM2)
```bash
pm2 status
```

### Restart (PM2)
```bash
pm2 restart api-painel
```

## Backup do Banco

```bash
# Backup SQLite
cp prisma/dev.db prisma/dev.db.backup

# Restaurar
cp prisma/dev.db.backup prisma/dev.db
```

## Dicas Rápidas

```bash
# Ver versão do Node
node -v

# Ver versão do npm
npm -v

# Limpar cache do npm
npm cache clean --force

# Atualizar dependências
npm update

# Verificar dependências desatualizadas
npm outdated

# Instalar dependência específica
npm install nome-pacote@versao
```
