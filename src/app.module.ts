import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AuthModule } from './modules/auth.module';
import { UsersModule } from './modules/users.module';
import { DomainExceptionFilter } from '@interfaces/http/filters/domain-exception.filter';

@Module({
  imports: [AuthModule, UsersModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
  ],
})
export class AppModule {}
