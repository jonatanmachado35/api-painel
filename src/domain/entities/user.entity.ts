export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface UserProps {
  id: string;
  email: string;
  password: string;
  credits: number;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private constructor(private props: UserProps) {}

  static create(props: Omit<UserProps, 'id' | 'createdAt' | 'updatedAt'>): User {
    return new User({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: UserProps): User {
    return new User(props);
  }

  get id(): string {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get credits(): number {
    return this.props.credits;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  isAdmin(): boolean {
    return this.props.role === UserRole.ADMIN;
  }

  hasCredits(): boolean {
    return this.props.credits > 0;
  }

  consumeCredit(): void {
    if (!this.hasCredits()) {
      throw new Error('Insufficient credits');
    }
    this.props.credits -= 1;
    this.props.updatedAt = new Date();
  }

  addCredits(amount: number): void {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }
    this.props.credits += amount;
    this.props.updatedAt = new Date();
  }

  toObject(): UserProps {
    return { ...this.props };
  }
}
