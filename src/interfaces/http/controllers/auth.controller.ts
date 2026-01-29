import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { LoginUseCase } from '@application/use-cases/login.use-case';
import { LoginDto } from '../dtos/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Fazer login',
    description: 'Autentica um usuário e retorna um token JWT válido por 7 dias.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'usuario@example.com',
          role: 'USER',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() loginDto: LoginDto) {
    // Gera o token JWT primeiro
    const temporaryPayload = {
      email: loginDto.email,
      timestamp: Date.now(),
    };
    const sessionToken = this.jwtService.sign(temporaryPayload);

    // Executa login e salva o token no banco
    const result = await this.loginUseCase.execute({
      email: loginDto.email,
      password: loginDto.password,
      sessionToken,
    });

    // Gera o token final com os dados corretos
    const token = this.jwtService.sign({
      sub: result.userId,
      email: result.email,
      role: result.role,
    });

    return {
      access_token: token,
      user: {
        id: result.userId,
        email: result.email,
        role: result.role,
      },
    };
  }
}
