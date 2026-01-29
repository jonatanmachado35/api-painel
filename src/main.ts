import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors();

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('API Painel - Sistema de Gestão de Créditos')
    .setDescription(
      `API RESTful construída com NestJS seguindo Clean Architecture para gerenciamento de usuários e créditos.\n\n` +
      `## Funcionalidades\n\n` +
      `- ✅ Autenticação JWT\n` +
      `- ✅ Cadastro de usuários **apenas por administradores**\n` +
      `- ✅ Novos usuários recebem 10 créditos iniciais\n` +
      `- ✅ Sistema de créditos por consumo\n` +
      `- ✅ Controle de permissões (USER/ADMIN)\n` +
      `- ✅ Apenas admins podem adicionar créditos\n\n` +
      `## Credenciais Admin Padrão\n\n` +
      `- Email: admin@example.com\n` +
      `- Senha: admin123456\n\n` +
      `## Como Usar\n\n` +
      `1. Faça login como admin em /auth/login\n` +
      `2. Copie o token JWT retornado\n` +
      `3. Clique no botão 'Authorize' acima e cole o token\n` +
      `4. Agora você pode cadastrar usuários e gerenciar créditos\n\n` +
      `## ⚠️ Importante\n\n` +
      `**Apenas administradores** podem cadastrar novos usuários. Usuários comuns podem apenas:\n` +
      `- Ver seus próprios créditos\n` +
      `- Consumir seus créditos`
    )
    .setVersion('1.0')
    .addTag('auth', 'Endpoints de autenticação')
    .addTag('users', 'Gerenciamento de usuários e créditos (protegido)')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Digite o token JWT (obtido no login)',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'API Painel - Documentação',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      tagsSorter: 'alpha',
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
