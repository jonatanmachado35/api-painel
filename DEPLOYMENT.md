# 🚀 Guia de Deploy para Produção

## 📋 Checklist Pré-Deploy

- [ ] Atualizar variáveis de ambiente
- [ ] Configurar banco de dados de produção
- [ ] Build da aplicação
- [ ] Testes passando
- [ ] Segurança configurada

## 🔐 Variáveis de Ambiente

### Desenvolvimento (.env)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="development"
```

### Produção (.env.production)
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
# ou MySQL: "mysql://user:password@host:3306/database"
# ou SQLite: "file:./prod.db"

JWT_SECRET="MUDE-ISSO-PARA-UM-SECRET-FORTE-E-ALEATORIO"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="production"
CORS_ORIGIN="https://seu-frontend.com"
```

⚠️ **Importante:** Nunca commite o `.env` no git!

---

## 🗄️ Migração de Banco de Dados

### Opção 1: PostgreSQL (Recomendado para Produção)

1. **Atualizar schema.prisma:**
```prisma
datasource db {
  provider = "postgresql"  // Mudou de sqlite para postgresql
  url      = env("DATABASE_URL")
}
```

2. **Criar nova migration:**
```bash
npx prisma migrate dev --name init_postgresql
```

3. **Aplicar em produção:**
```bash
npx prisma migrate deploy
```

### Opção 2: Continuar com SQLite

```bash
# Apenas aplicar migrations
npx prisma migrate deploy
```

---

## 🏗️ Build e Deploy

### 1. Build Local

```bash
# Limpar dist anterior
rm -rf dist

# Build
npm run build

# Testar build localmente
node dist/main.js
```

### 2. Deploy em VPS (Ubuntu/Debian)

```bash
# 1. Conectar ao servidor
ssh user@seu-servidor.com

# 2. Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Instalar PM2
sudo npm install -g pm2

# 4. Clonar projeto
git clone seu-repositorio.git
cd api-painel

# 5. Instalar dependências
npm ci --only=production

# 6. Configurar .env
nano .env
# Cole as variáveis de produção

# 7. Gerar Prisma Client
npm run prisma:generate

# 8. Aplicar migrations
npx prisma migrate deploy

# 9. Criar admin (se necessário)
npm run prisma:seed

# 10. Build
npm run build

# 11. Iniciar com PM2
pm2 start dist/main.js --name api-painel

# 12. Salvar processo
pm2 save
pm2 startup
```

### 3. Deploy com Docker

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci --only=production

# Copiar código
COPY . .

# Gerar Prisma Client
RUN npm run prisma:generate

# Build
RUN npm run build

# Expor porta
EXPOSE 3000

# Comando de início
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=file:./prod.db
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
    volumes:
      - ./data:/app/data
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=apiuser
      - POSTGRES_PASSWORD=strong_password
      - POSTGRES_DB=apipainel
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

**Comandos:**
```bash
# Build
docker-compose build

# Subir
docker-compose up -d

# Ver logs
docker-compose logs -f api

# Parar
docker-compose down
```

### 4. Deploy na Vercel/Railway/Render

**vercel.json:**
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
  ]
}
```

**Comandos:**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 5. Deploy na AWS EC2

```bash
# 1. Conectar via SSH
ssh -i sua-chave.pem ubuntu@ec2-ip.compute.amazonaws.com

# 2. Atualizar sistema
sudo apt update && sudo apt upgrade -y

# 3. Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Instalar PM2
sudo npm install -g pm2

# 5. Configurar aplicação
git clone seu-repo.git
cd api-painel
npm ci --only=production
npm run prisma:generate
npx prisma migrate deploy
npm run build

# 6. Iniciar com PM2
pm2 start dist/main.js --name api-painel
pm2 startup
pm2 save

# 7. Configurar Nginx (opcional)
sudo apt install nginx
sudo nano /etc/nginx/sites-available/api
```

**Configuração Nginx:**
```nginx
server {
    listen 80;
    server_name api.seudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔒 SSL/HTTPS com Let's Encrypt

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d api.seudominio.com

# Renovação automática já está configurada
```

---

## 📊 Monitoramento

### PM2 Monitoring

```bash
# Ver status
pm2 status

# Ver logs
pm2 logs api-painel

# Ver métricas
pm2 monit

# Restart
pm2 restart api-painel

# Reload (zero downtime)
pm2 reload api-painel
```

### Health Check Endpoint

Adicione em `src/app.controller.ts`:
```typescript
@Get('health')
health() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
  };
}
```

---

## 🔐 Segurança em Produção

### 1. Helmet (Proteção de Headers)

```bash
npm install helmet
```

```typescript
// src/main.ts
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(helmet());
  
  // ... resto do código
}
```

### 2. Rate Limiting

```bash
npm install @nestjs/throttler
```

```typescript
// src/app.module.ts
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    // ... outros módulos
  ],
})
```

### 3. CORS Configurado

```typescript
// src/main.ts
app.enableCors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
});
```

---

## 📝 Logs em Produção

### Winston Logger

```bash
npm install winston nest-winston
```

```typescript
// src/main.ts
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

const app = await NestFactory.create(AppModule, {
  logger: WinstonModule.createLogger({
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  }),
});
```

---

## 🧪 CI/CD com GitHub Actions

**.github/workflows/deploy.yml:**
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
    
    - name: Deploy to server
      uses: easingthemes/ssh-deploy@main
      env:
        SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
        REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
        REMOTE_USER: ${{ secrets.REMOTE_USER }}
        TARGET: /home/user/api-painel
```

---

## 📈 Escalabilidade

### Cluster Mode (PM2)

```bash
pm2 start dist/main.js -i max --name api-painel
```

### Load Balancer (Nginx)

```nginx
upstream api_servers {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
}

server {
    location / {
        proxy_pass http://api_servers;
    }
}
```

---

## ✅ Checklist Final

- [ ] Variáveis de ambiente configuradas
- [ ] JWT_SECRET forte e aleatório
- [ ] Banco de dados de produção configurado
- [ ] Migrations aplicadas
- [ ] SSL/HTTPS ativo
- [ ] CORS configurado
- [ ] Rate limiting ativo
- [ ] Helmet configurado
- [ ] Logs funcionando
- [ ] Monitoramento ativo
- [ ] Backup automático do banco
- [ ] Health check endpoint
- [ ] CI/CD configurado

---

**Sua API está pronta para produção!** 🎉
