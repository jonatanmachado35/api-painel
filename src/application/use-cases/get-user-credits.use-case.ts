import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { UserNotFoundException } from '@domain/exceptions/domain.exceptions';

export interface GetUserCreditsInput {
  userId: string;
}

export interface GetUserCreditsOutput {
  userId: string;
  email: string;
  credits: number;
  role: string;
}

export class GetUserCreditsUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: GetUserCreditsInput): Promise<GetUserCreditsOutput> {
    const user = await this.userRepository.findById(input.userId);

    if (!user) {
      throw new UserNotFoundException();
    }

    return {
      userId: user.id,
      email: user.email,
      credits: user.credits,
      role: user.role,
    };
  }
}
