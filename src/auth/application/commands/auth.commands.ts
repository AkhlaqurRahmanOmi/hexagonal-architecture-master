import { ICommand } from '../../../shared/cqrs';

export class RegisterUserCommand implements ICommand {
  constructor(
    public readonly tenantName: string,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
  ) {}
}

export class LoginUserCommand implements ICommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}

export class RefreshTokenCommand implements ICommand {
  constructor(public readonly refreshToken: string) {}
}
