import { Module } from '@nestjs/common';
import { UsersController } from '@interfaces/http/controllers/users.controller';
import { RegisterUserUseCase } from '@application/use-cases/register-user.use-case';
import { ConsumeCreditUseCase } from '@application/use-cases/consume-credit.use-case';
import { AddCreditsUseCase } from '@application/use-cases/add-credits.use-case';
import { GetUserCreditsUseCase } from '@application/use-cases/get-user-credits.use-case';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { IHashService } from '@application/ports/hash.service.interface';
import { PrismaUserRepository } from '@infrastructure/repositories/prisma-user.repository';
import { BcryptHashService } from '@infrastructure/services/bcrypt-hash.service';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { SessionGuard } from '@interfaces/http/guards/session.guard';
import { USER_REPOSITORY, HASH_SERVICE } from '@application/ports/injection-tokens';

@Module({
  controllers: [UsersController],
  providers: [
    PrismaService,
    SessionGuard,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    {
      provide: HASH_SERVICE,
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
      inject: [USER_REPOSITORY, HASH_SERVICE],
    },
    {
      provide: ConsumeCreditUseCase,
      useFactory: (userRepository: IUserRepository) => {
        return new ConsumeCreditUseCase(userRepository);
      },
      inject: [USER_REPOSITORY],
    },
    {
      provide: AddCreditsUseCase,
      useFactory: (userRepository: IUserRepository) => {
        return new AddCreditsUseCase(userRepository);
      },
      inject: [USER_REPOSITORY],
    },
    {
      provide: GetUserCreditsUseCase,
      useFactory: (userRepository: IUserRepository) => {
        return new GetUserCreditsUseCase(userRepository);
      },
      inject: [USER_REPOSITORY],
    },
  ],
})
export class UsersModule {}
