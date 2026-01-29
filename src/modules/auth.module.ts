import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '@interfaces/http/controllers/auth.controller';
import { RegisterUserUseCase } from '@application/use-cases/register-user.use-case';
import { LoginUseCase } from '@application/use-cases/login.use-case';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { IHashService } from '@application/ports/hash.service.interface';
import { PrismaUserRepository } from '@infrastructure/repositories/prisma-user.repository';
import { BcryptHashService } from '@infrastructure/services/bcrypt-hash.service';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { JwtStrategy } from '@interfaces/http/strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    JwtStrategy,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: IHashService,
      useClass: BcryptHashService,
    },
    {
      provide: RegisterUserUseCase,
      useFactory: (
        userRepository: IUserRepository,
        hashService: IHashService,
      ) => {
        return new RegisterUserUseCase(userRepository, hashService);
      },
      inject: [IUserRepository, IHashService],
    },
    {
      provide: LoginUseCase,
      useFactory: (
        userRepository: IUserRepository,
        hashService: IHashService,
      ) => {
        return new LoginUseCase(userRepository, hashService);
      },
      inject: [IUserRepository, IHashService],
    },
  ],
})
export class AuthModule {}
