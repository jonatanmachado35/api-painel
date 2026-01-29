import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ConsumeCreditUseCase } from '@application/use-cases/consume-credit.use-case';
import { AddCreditsUseCase } from '@application/use-cases/add-credits.use-case';
import { GetUserCreditsUseCase } from '@application/use-cases/get-user-credits.use-case';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { AddCreditsDto } from '../dtos/add-credits.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly consumeCreditUseCase: ConsumeCreditUseCase,
    private readonly addCreditsUseCase: AddCreditsUseCase,
    private readonly getUserCreditsUseCase: GetUserCreditsUseCase,
  ) {}

  @Get('me/credits')
  async getMyCredits(@Request() req) {
    const result = await this.getUserCreditsUseCase.execute({
      userId: req.user.userId,
    });

    return result;
  }

  @Post('consume-credit')
  async consumeCredit(@Request() req) {
    const result = await this.consumeCreditUseCase.execute({
      userId: req.user.userId,
    });

    return result;
  }

  @Post('add-credits')
  @UseGuards(AdminGuard)
  async addCredits(@Request() req, @Body() addCreditsDto: AddCreditsDto) {
    const result = await this.addCreditsUseCase.execute({
      adminId: req.user.userId,
      targetUserId: addCreditsDto.targetUserId,
      amount: addCreditsDto.amount,
    });

    return result;
  }
}
