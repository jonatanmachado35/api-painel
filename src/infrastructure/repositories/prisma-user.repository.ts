import { Injectable } from '@nestjs/common';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { User, UserRole } from '@domain/entities/user.entity';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    const userProps = user.toObject();
    
    const createdUser = await this.prisma.user.create({
      data: {
        id: userProps.id,
        email: userProps.email,
        password: userProps.password,
        credits: userProps.credits,
        role: userProps.role,
      },
    });

    return User.reconstitute({
      id: createdUser.id,
      email: createdUser.email,
      password: createdUser.password,
      credits: createdUser.credits,
      role: createdUser.role as UserRole,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt,
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return User.reconstitute({
      id: user.id,
      email: user.email,
      password: user.password,
      credits: user.credits,
      role: user.role as UserRole,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return User.reconstitute({
      id: user.id,
      email: user.email,
      password: user.password,
      credits: user.credits,
      role: user.role as UserRole,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async save(user: User): Promise<User> {
    const userProps = user.toObject();

    const updatedUser = await this.prisma.user.update({
      where: { id: userProps.id },
      data: {
        email: userProps.email,
        password: userProps.password,
        credits: userProps.credits,
        role: userProps.role,
        updatedAt: userProps.updatedAt,
      },
    });

    return User.reconstitute({
      id: updatedUser.id,
      email: updatedUser.email,
      password: updatedUser.password,
      credits: updatedUser.credits,
      role: updatedUser.role as UserRole,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    });
  }
}
