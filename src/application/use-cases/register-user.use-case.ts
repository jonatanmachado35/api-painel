import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { IHashService } from '../ports/hash.service.interface';
import { User, UserRole } from '@domain/entities/user.entity';
import { UserAlreadyExistsException } from '@domain/exceptions/domain.exceptions';

export interface RegisterUserInput {
  email: string;
  password: string;
  isAdmin?: boolean;
}

export interface RegisterUserOutput {
  id: string;
  email: string;
  credits: number;
  role: UserRole;
}

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService,
  ) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    const existingUser = await this.userRepository.findByEmail(input.email);
    
    if (existingUser) {
      throw new UserAlreadyExistsException();
    }

    const hashedPassword = await this.hashService.hash(input.password);

    const user = User.create({
      email: input.email,
      password: hashedPassword,
      credits: input.isAdmin ? 0 : 10, // Usuários começam com 10 créditos
      role: input.isAdmin ? UserRole.ADMIN : UserRole.USER,
    });

    const savedUser = await this.userRepository.create(user);

    return {
      id: savedUser.id,
      email: savedUser.email,
      credits: savedUser.credits,
      role: savedUser.role,
    };
  }
}
