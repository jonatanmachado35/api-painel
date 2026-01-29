import { ConsumeCreditUseCase } from '@application/use-cases/consume-credit.use-case';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { User, UserRole } from '@domain/entities/user.entity';
import {
  InsufficientCreditsException,
  UserNotFoundException,
} from '@domain/exceptions/domain.exceptions';

describe('ConsumeCreditUseCase', () => {
  let useCase: ConsumeCreditUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    userRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
    };

    useCase = new ConsumeCreditUseCase(userRepository);
  });

  it('should consume one credit successfully', async () => {
    const user = User.create({
      email: 'test@example.com',
      password: 'hashedpassword',
      credits: 10,
      role: UserRole.USER,
    });

    userRepository.findById.mockResolvedValue(user);
    userRepository.save.mockResolvedValue(user);

    const result = await useCase.execute({ userId: user.id });

    expect(result.remainingCredits).toBe(9);
    expect(result.message).toBe('Credit consumed successfully');
    expect(userRepository.save).toHaveBeenCalledWith(user);
  });

  it('should throw UserNotFoundException when user does not exist', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ userId: 'non-existent-id' }),
    ).rejects.toThrow(UserNotFoundException);
  });

  it('should throw InsufficientCreditsException when user has no credits', async () => {
    const user = User.create({
      email: 'test@example.com',
      password: 'hashedpassword',
      credits: 0,
      role: UserRole.USER,
    });

    userRepository.findById.mockResolvedValue(user);

    await expect(useCase.execute({ userId: user.id })).rejects.toThrow(
      InsufficientCreditsException,
    );
  });
});
