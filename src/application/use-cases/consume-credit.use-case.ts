import { IUserRepository } from '@domain/repositories/user.repository.interface';
import {
  InsufficientCreditsException,
  UserNotFoundException,
} from '@domain/exceptions/domain.exceptions';

export interface ConsumeCreditInput {
  userId: string;
}

export interface ConsumeCreditOutput {
  remainingCredits: number;
  message: string;
}

export class ConsumeCreditUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: ConsumeCreditInput): Promise<ConsumeCreditOutput> {
    const user = await this.userRepository.findById(input.userId);

    if (!user) {
      throw new UserNotFoundException();
    }

    if (!user.hasCredits()) {
      throw new InsufficientCreditsException();
    }

    user.consumeCredit();
    await this.userRepository.save(user);

    return {
      remainingCredits: user.credits,
      message: 'Credit consumed successfully',
    };
  }
}
