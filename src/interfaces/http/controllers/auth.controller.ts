import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserUseCase } from '@application/use-cases/register-user.use-case';
import { LoginUseCase } from '@application/use-cases/login.use-case';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.registerUserUseCase.execute({
      email: registerDto.email,
      password: registerDto.password,
    });

    return {
      message: 'User registered successfully',
      user: result,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const result = await this.loginUseCase.execute({
      email: loginDto.email,
      password: loginDto.password,
    });

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
