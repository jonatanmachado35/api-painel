import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { RegisterUserUseCase } from '@application/use-cases/register-user.use-case';
import { ConsumeCreditUseCase } from '@application/use-cases/consume-credit.use-case';
import { AddCreditsUseCase } from '@application/use-cases/add-credits.use-case';
import { GetUserCreditsUseCase } from '@application/use-cases/get-user-credits.use-case';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { RegisterDto } from '../dtos/register.dto';
import { AddCreditsDto } from '../dtos/add-credits.dto';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly consumeCreditUseCase: ConsumeCreditUseCase,
    private readonly addCreditsUseCase: AddCreditsUseCase,
    private readonly getUserCreditsUseCase: GetUserCreditsUseCase,
  ) {}

  @Post('register')
  @UseGuards(AdminGuard)
  @ApiOperation({ 
    summary: 'Cadastrar novo usuário (Admin apenas)',
    description: 'Cria um novo usuário no sistema. **Apenas administradores** podem cadastrar novos usuários. Usuários novos recebem 10 créditos iniciais automaticamente.',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Usuário cadastrado com sucesso',
    schema: {
      example: {
        message: 'User registered successfully',
        user: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'novousuario@example.com',
          credits: 10,
          role: 'USER',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos (email inválido ou senha muito curta)' })
  @ApiResponse({ status: 401, description: 'Não autenticado ou usuário não é admin' })
  @ApiResponse({ status: 409, description: 'Email já cadastrado' })
  async registerUser(@Body() registerDto: RegisterDto) {
    const result = await this.registerUserUseCase.execute({
      email: registerDto.email,
      password: registerDto.password,
    });

    return {
      message: 'User registered successfully',
      user: result,
    };
  }

  @Get('me/credits')
  @ApiOperation({ 
    summary: 'Ver meus créditos',
    description: 'Retorna o saldo atual de créditos do usuário autenticado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Saldo de créditos retornado com sucesso',
    schema: {
      example: {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        email: 'usuario@example.com',
        credits: 10,
        role: 'USER',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Não autenticado (token inválido ou ausente)' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async getMyCredits(@Request() req: ExpressRequest & { user: { userId: string } }) {
    const result = await this.getUserCreditsUseCase.execute({
      userId: req.user.userId,
    });

    return result;
  }

  @Post('consume-credit')
  @ApiOperation({ 
    summary: 'Consumir 1 crédito',
    description: 'Consome 1 crédito do saldo do usuário autenticado. Retorna erro se não houver créditos suficientes.',
  })
  @ApiResponse({
    status: 201,
    description: 'Crédito consumido com sucesso',
    schema: {
      example: {
        remainingCredits: 9,
        message: 'Credit consumed successfully',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 402, description: 'Créditos insuficientes (saldo zerado)' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async consumeCredit(@Request() req: ExpressRequest & { user: { userId: string } }) {
    const result = await this.consumeCreditUseCase.execute({
      userId: req.user.userId,
    });

    return result;
  }

  @Post('add-credits')
  @UseGuards(AdminGuard)
  @ApiOperation({ 
    summary: 'Adicionar créditos (Admin apenas)',
    description: 'Adiciona créditos ao saldo de um usuário específico. **Apenas administradores** podem usar este endpoint.',
  })
  @ApiBody({ type: AddCreditsDto })
  @ApiResponse({
    status: 201,
    description: 'Créditos adicionados com sucesso',
    schema: {
      example: {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        newCreditBalance: 60,
        message: 'Successfully added 50 credits',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Não autenticado ou usuário não é admin' })
  @ApiResponse({ status: 404, description: 'Usuário alvo não encontrado' })
  @ApiResponse({ status: 400, description: 'Quantidade inválida (deve ser >= 1)' })
  async addCredits(@Request() req: ExpressRequest & { user: { userId: string } }, @Body() addCreditsDto: AddCreditsDto) {
    const result = await this.addCreditsUseCase.execute({
      adminId: req.user.userId,
      targetUserId: addCreditsDto.targetUserId,
      amount: addCreditsDto.amount,
    });

    return result;
  }
}
