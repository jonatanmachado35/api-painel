import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { IHashService } from '../ports/hash.service.interface';
import { UnauthorizedException } from '@domain/exceptions/domain.exceptions';

export interface LoginInput {
  email: string;
  password: string;
  sessionToken: string;
}

export interface LoginOutput {
  userId: string;
  email: string;
  role: string;
}

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService,
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await this.hashService.compare(
      input.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    // Atualiza o token da sessão, invalidando qualquer sessão anterior
    user.updateSessionToken(input.sessionToken);
    await this.userRepository.save(user);

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
