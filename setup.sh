#!/bin/bash

echo "🚀 Configurando API Painel..."
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Instalar dependências
echo "${YELLOW}📦 Instalando dependências...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

echo "${GREEN}✅ Dependências instaladas${NC}"
echo ""

# 2. Gerar Prisma Client
echo "${YELLOW}🔧 Gerando Prisma Client...${NC}"
npm run prisma:generate

if [ $? -ne 0 ]; then
    echo "❌ Erro ao gerar Prisma Client"
    exit 1
fi

echo "${GREEN}✅ Prisma Client gerado${NC}"
echo ""

# 3. Criar banco e aplicar migrations
echo "${YELLOW}💾 Criando banco de dados...${NC}"
npm run prisma:migrate

if [ $? -ne 0 ]; then
    echo "❌ Erro ao criar banco de dados"
    exit 1
fi

echo "${GREEN}✅ Banco de dados criado${NC}"
echo ""

# 4. Criar usuário admin
echo "${YELLOW}👤 Criando usuário admin...${NC}"
npm run prisma:seed

if [ $? -ne 0 ]; then
    echo "⚠️  Aviso: Não foi possível criar o admin (pode já existir)"
else
    echo "${GREEN}✅ Admin criado com sucesso${NC}"
    echo ""
    echo "📧 Email: admin@example.com"
    echo "🔑 Senha: admin123456"
fi

echo ""
echo "${GREEN}🎉 Configuração concluída!${NC}"
echo ""
echo "Para iniciar o servidor, execute:"
echo "  ${YELLOW}npm run start:dev${NC}"
echo ""
echo "Documentação:"
echo "  - README.md - Documentação completa"
echo "  - QUICKSTART.md - Guia rápido"
echo "  - ARCHITECTURE.md - Arquitetura do sistema"
echo "  - COMMANDS.md - Comandos úteis"
echo "  - api-examples.http - Exemplos de requisições"
