import { ICommand } from '../../../shared/cqrs';

export class RegisterUserCommand implements ICommand {
  constructor(
    public readonly tenantId: string,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
  ) {}
}

export class LoginUserCommand implements ICommand {
  constructor(
    public readonly tenantId: string,
    public readonly email: string,
    public readonly password: string,
  ) {}
}
