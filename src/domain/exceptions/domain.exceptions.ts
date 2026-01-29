export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
  }
}

export class InsufficientCreditsException extends DomainException {
  constructor() {
    super('Insufficient credits');
    this.name = 'InsufficientCreditsException';
  }
}

export class UserNotFoundException extends DomainException {
  constructor() {
    super('User not found');
    this.name = 'UserNotFoundException';
  }
}

export class UserAlreadyExistsException extends DomainException {
  constructor() {
    super('User already exists');
    this.name = 'UserAlreadyExistsException';
  }
}

export class UnauthorizedException extends DomainException {
  constructor() {
    super('Unauthorized');
    this.name = 'UnauthorizedException';
  }
}
