import { Inject, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '../../../shared/cqrs';
import { RegisterUserCommand, LoginUserCommand } from '../commands/auth.commands';
import { PASSWORD_HASHER, PasswordHasherPort, TOKEN_SERVICE, TokenServicePort } from '../ports';
import { USER_REPOSITORY, UserRepositoryPort } from '../../../user/application/ports';
import { User } from '../../../user/domain/entities';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand, User> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async execute(command: RegisterUserCommand): Promise<User> {
    const { tenantId, name, email, password } = command;
    if (!tenantId) {
      throw new BadRequestException('TenantId is required');
    }

    const existing = await this.userRepository.findByEmail(tenantId, email);
    if (existing) {
      throw new ConflictException('User already exists');
    }

    const passwordHash = await this.passwordHasher.hash(password);
    const user = User.create(name, email, tenantId, passwordHash);
    return this.userRepository.save(user);
  }
}

@CommandHandler(LoginUserCommand)
export class LoginUserHandler
  implements ICommandHandler<LoginUserCommand, { accessToken: string }>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherPort,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenServicePort,
  ) {}

  async execute(command: LoginUserCommand): Promise<{ accessToken: string }> {
    const { tenantId, email, password } = command;
    if (!tenantId) {
      throw new BadRequestException('TenantId is required');
    }

    const user = await this.userRepository.findByEmail(tenantId, email);
    if (!user || !user.getPasswordHash()) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const ok = await this.passwordHasher.compare(password, user.getPasswordHash() || '');
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.getId().getValue(),
      tenantId: user.getTenantId().getValue(),
      email: user.getEmail().getValue(),
    };

    return {
      accessToken: await this.tokenService.sign(payload),
    };
  }
}

export const AUTH_HANDLERS = [RegisterUserHandler, LoginUserHandler];
