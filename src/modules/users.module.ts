import { Module } from '@nestjs/common';
import { UsersController } from '@interfaces/http/controllers/users.controller';
import { ConsumeCreditUseCase } from '@application/use-cases/consume-credit.use-case';
import { AddCreditsUseCase } from '@application/use-cases/add-credits.use-case';
import { GetUserCreditsUseCase } from '@application/use-cases/get-user-credits.use-case';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { PrismaUserRepository } from '@infrastructure/repositories/prisma-user.repository';
import { PrismaService } from '@infrastructure/database/prisma.service';

@Module({
  controllers: [UsersController],
  providers: [
    PrismaService,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: ConsumeCreditUseCase,
      useFactory: (userRepository: IUserRepository) => {
        return new ConsumeCreditUseCase(userRepository);
      },
      inject: [IUserRepository],
    },
    {
      provide: AddCreditsUseCase,
      useFactory: (userRepository: IUserRepository) => {
        return new AddCreditsUseCase(userRepository);
      },
      inject: [IUserRepository],
    },
    {
      provide: GetUserCreditsUseCase,
      useFactory: (userRepository: IUserRepository) => {
        return new GetUserCreditsUseCase(userRepository);
      },
      inject: [IUserRepository],
    },
  ],
})
export class UsersModule {}
