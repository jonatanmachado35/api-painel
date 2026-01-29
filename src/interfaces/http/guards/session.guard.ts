import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '@application/ports/injection-tokens';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user: { userId: string } }>();
    const userId = request.user?.userId;

    if (!userId) {
      throw new UnauthorizedException('User ID not found in request');
    }

    // Extrai o token do header Authorization
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const currentToken = authHeader.substring(7);

    // Busca o usuário e verifica se o token ainda é válido
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verifica se o token atual é o mesmo que está salvo no banco
    if (user.currentSessionToken !== currentToken) {
      throw new UnauthorizedException(
        'Session invalidated. Another login detected for this account.'
      );
    }

    return true;
  }
}
