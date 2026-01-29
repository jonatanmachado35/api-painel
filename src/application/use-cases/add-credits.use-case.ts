import { IUserRepository } from '@domain/repositories/user.repository.interface';
import {
  UnauthorizedException,
  UserNotFoundException,
} from '@domain/exceptions/domain.exceptions';

export interface AddCreditsInput {
  adminId: string;
  targetUserId: string;
  amount: number;
}

export interface AddCreditsOutput {
  userId: string;
  newCreditBalance: number;
  message: string;
}

export class AddCreditsUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: AddCreditsInput): Promise<AddCreditsOutput> {
    // Verifica se quem está adicionando é admin
    const admin = await this.userRepository.findById(input.adminId);

    if (!admin) {
      throw new UserNotFoundException();
    }

    if (!admin.isAdmin()) {
      throw new UnauthorizedException();
    }

    // Busca o usuário alvo
    const targetUser = await this.userRepository.findById(input.targetUserId);

    if (!targetUser) {
      throw new UserNotFoundException();
    }

    targetUser.addCredits(input.amount);
    await this.userRepository.save(targetUser);

    return {
      userId: targetUser.id,
      newCreditBalance: targetUser.credits,
      message: `Successfully added ${input.amount} credits`,
    };
  }
}
