# 📚 Índice de Documentação - API Painel

Bem-vindo à documentação completa da API de Gestão de Créditos!

---

## 🚀 Para Começar

### [QUICKSTART.md](QUICKSTART.md) ⭐
**Comece aqui!** Guia rápido de 5 minutos para ter a API rodando.
- Instalação
- Configuração do banco
- Primeiro usuário admin
- Testes básicos

### [SUMMARY.md](SUMMARY.md)
Visão executiva do projeto completo.
- O que foi criado
- Estrutura do projeto
- Funcionalidades
- Tecnologias usadas

---

## 📖 Documentação Principal

### [README.md](README.md)
Documentação completa e detalhada.
- Arquitetura do projeto
- Todos os endpoints
- Autenticação e autorização
- Banco de dados
- Scripts disponíveis
- Segurança
- Regras de negócio

### [ARCHITECTURE.md](ARCHITECTURE.md)
Explicação profunda da arquitetura.
- Clean Architecture
- Fluxo de requisições
- Dependências entre camadas
- Princípios SOLID aplicados
- Diagrama de camadas
- Benefícios da arquitetura

---

## 🛠️ Guias Práticos

### [COMMANDS.md](COMMANDS.md)
Todos os comandos úteis do dia a dia.
- Desenvolvimento
- Banco de dados (Prisma)
- Testes
- Code quality
- Troubleshooting
- Backup

### [TESTING_GUIDE.md](TESTING_GUIDE.md)
Guia completo para testar a API.
- Fluxo de testes passo a passo
- Exemplos com curl
- Casos de sucesso e erro
- Debugging com Prisma Studio
- Checklist de testes

### [TESTING.md](TESTING.md)
Estrutura e exemplos de testes automatizados.
- Testes unitários (Use Cases)
- Testes de integração (Repositórios)
- Testes E2E (Controllers)
- Testes de domínio (Entities)
- Cobertura de código
- Boas práticas

---

## 🚀 Deploy e Produção

### [DEPLOYMENT.md](DEPLOYMENT.md)
Guia completo de deploy para produção.
- Checklist pré-deploy
- Variáveis de ambiente
- Deploy em VPS (Ubuntu/Debian)
- Deploy com Docker
- Deploy na Vercel/Railway/Render
- Deploy na AWS EC2
- SSL/HTTPS
- Monitoramento
- Segurança em produção
- CI/CD

---

## 📁 Arquivos de Apoio

### [api-examples.http](api-examples.http)
Exemplos de requisições HTTP prontos para usar.
- Usar com VS Code + extensão REST Client
- Ou copiar para Postman/Insomnia

### [postman-collection.json](postman-collection.json)
Coleção completa do Postman.
- Importar diretamente no Postman/Insomnia
- Variáveis de ambiente pré-configuradas
- Scripts para salvar tokens automaticamente
- Casos de teste e erro

### [setup.sh](setup.sh)
Script de setup automático.
```bash
./setup.sh
```
- Instala dependências
- Configura Prisma
- Cria banco de dados
- Cria usuário admin

---

## 📂 Estrutura de Pastas

```
api-painel/
│
├── 📄 Documentação
│   ├── README.md              ← Docs principal
│   ├── QUICKSTART.md          ← Comece aqui
│   ├── SUMMARY.md             ← Visão geral
│   ├── ARCHITECTURE.md        ← Arquitetura
│   ├── COMMANDS.md            ← Comandos úteis
│   ├── TESTING_GUIDE.md       ← Guia de testes
│   ├── TESTING.md             ← Testes automatizados
│   └── DEPLOYMENT.md          ← Deploy produção
│
├── 🔧 Configuração
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   ├── .env
│   ├── .gitignore
│   └── setup.sh               ← Script de setup
│
├── 🗄️ Banco de Dados
│   └── prisma/
│       ├── schema.prisma      ← Schema do banco
│       ├── seed.ts            ← Criar admin
│       └── migrations/        ← Histórico
│
├── 📦 Código Fonte
│   └── src/
│       ├── domain/            ← Regras de negócio
│       ├── application/       ← Casos de uso
│       ├── infrastructure/    ← Prisma, bcrypt
│       ├── interfaces/        ← Controllers, DTOs
│       ├── modules/           ← Módulos NestJS
│       ├── app.module.ts
│       └── main.ts
│
└── 🧪 Testes
    ├── api-examples.http      ← Exemplos HTTP
    └── postman-collection.json ← Coleção Postman
```

---

## 🎯 Casos de Uso por Perfil

### 👨‍💻 Desenvolvedor Iniciante
1. [QUICKSTART.md](QUICKSTART.md) - Setup rápido
2. [api-examples.http](api-examples.http) - Testar endpoints
3. [README.md](README.md) - Entender funcionalidades
4. [TESTING_GUIDE.md](TESTING_GUIDE.md) - Como testar

### 🏗️ Arquiteto de Software
1. [ARCHITECTURE.md](ARCHITECTURE.md) - Decisões arquiteturais
2. [README.md](README.md) - Estrutura completa
3. [TESTING.md](TESTING.md) - Estratégia de testes
4. [src/](src/) - Código fonte limpo

### 🚀 DevOps / SysAdmin
1. [DEPLOYMENT.md](DEPLOYMENT.md) - Deploy completo
2. [COMMANDS.md](COMMANDS.md) - Comandos úteis
3. [.env](.env) - Variáveis de ambiente
4. [setup.sh](setup.sh) - Automação

### 🧪 QA / Tester
1. [TESTING_GUIDE.md](TESTING_GUIDE.md) - Fluxos de teste
2. [postman-collection.json](postman-collection.json) - Coleção Postman
3. [api-examples.http](api-examples.http) - Exemplos prontos
4. [TESTING.md](TESTING.md) - Testes automatizados

---

## 📊 Referência Rápida

### Endpoints Principais

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| POST | `/auth/register` | ❌ | Registrar usuário |
| POST | `/auth/login` | ❌ | Fazer login |
| GET | `/users/me/credits` | ✅ | Ver créditos |
| POST | `/users/consume-credit` | ✅ | Consumir 1 crédito |
| POST | `/users/add-credits` | 👑 | Adicionar créditos (admin) |

**Legenda:** ❌ Público | ✅ Autenticado | 👑 Admin

### Comandos Mais Usados

```bash
# Desenvolvimento
npm run start:dev

# Prisma Studio (GUI)
npm run prisma:studio

# Criar admin
npm run prisma:seed

# Testes
npm test

# Deploy
npm run build
npm run start:prod
```

### Credenciais Admin Padrão
```
Email: admin@example.com
Senha: admin123456
```

---

## 🆘 Precisa de Ajuda?

1. **Problema no setup?** → [QUICKSTART.md](QUICKSTART.md)
2. **Erro em produção?** → [DEPLOYMENT.md](DEPLOYMENT.md)
3. **Como testar?** → [TESTING_GUIDE.md](TESTING_GUIDE.md)
4. **Entender arquitetura?** → [ARCHITECTURE.md](ARCHITECTURE.md)
5. **Comandos específicos?** → [COMMANDS.md](COMMANDS.md)

---

## 🎓 Aprender Mais

- [NestJS Docs](https://docs.nestjs.com/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

---

**Desenvolvido com ❤️ seguindo as melhores práticas de engenharia de software**

Clean Architecture • SOLID • DDD • TDD • NestJS • Prisma • TypeScript
