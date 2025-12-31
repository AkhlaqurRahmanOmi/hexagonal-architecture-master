import { Inject, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '../../../shared/cqrs';
import {
  RegisterUserCommand,
  LoginUserCommand,
  RefreshTokenCommand,
} from '../commands/auth.commands';
import {
  PASSWORD_HASHER,
  PasswordHasherPort,
  TOKEN_SERVICE,
  TokenServicePort,
  REFRESH_TOKEN_REPOSITORY,
  RefreshTokenRepositoryPort,
} from '../ports';
import { USER_REPOSITORY, UserRepositoryPort } from '../../../user/application/ports';
import {
  TENANT_REPOSITORY,
  TENANT_MEMBERSHIP_REPOSITORY,
  TenantRepositoryPort,
  TenantMembershipRepositoryPort,
} from '../../../tenant/application/ports';
import { User } from '../../../user/domain/entities';
import { Tenant, TenantMembership } from '../../../tenant/domain/entities';
import { randomUUID } from 'node:crypto';
import {
  ROLE_ASSIGNMENT_REPOSITORY,
  ROLE_REPOSITORY,
  RoleAssignmentRepositoryPort,
  RoleRepositoryPort,
} from '../../../rbac/application/ports';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements
    ICommandHandler<
      RegisterUserCommand,
      { user: User; accessToken: string; refreshToken: string }
    >
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherPort,
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: TenantRepositoryPort,
    @Inject(TENANT_MEMBERSHIP_REPOSITORY)
    private readonly membershipRepository: TenantMembershipRepositoryPort,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenServicePort,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,
    @Inject(ROLE_ASSIGNMENT_REPOSITORY)
    private readonly roleAssignmentRepository: RoleAssignmentRepositoryPort,
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepositoryPort,
  ) {}

  async execute(
    command: RegisterUserCommand,
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const { tenantName, name, email, password } = command;
    if (!tenantName) {
      throw new BadRequestException('Tenant name is required');
    }

    const tenantExisting = await this.tenantRepository.findByName(tenantName);
    if (tenantExisting) {
      throw new ConflictException('Tenant already exists');
    }

    const tenant = Tenant.create(tenantName);
    const createdTenant = await this.tenantRepository.create(tenant);

    const existingUser = await this.userRepository.findByEmailGlobal(email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const passwordHash = await this.passwordHasher.hash(password);
    const user = User.create(name, email, createdTenant.getId().getValue(), passwordHash);
    const savedUser = await this.userRepository.save(user);

    const membership = TenantMembership.create(
      randomUUID(),
      createdTenant.getId().getValue(),
      savedUser.getId().getValue(),
      'admin',
    );
    await this.membershipRepository.create(membership);

    const authPayload = await this.buildAuthPayload(savedUser);
    const accessToken = await this.tokenService.signAccessToken(authPayload);
    const refreshToken = await this.tokenService.signRefreshToken({
      sub: authPayload.sub,
      tenantId: authPayload.tenantId,
    });
    const refreshHash = await this.passwordHasher.hash(refreshToken);
    await this.refreshTokenRepository.saveHashedToken({
      tenantId: authPayload.tenantId,
      userId: authPayload.sub,
      tokenHash: refreshHash,
      expiresAt: this.refreshExpiryDate(),
    });

    return { user: savedUser, accessToken, refreshToken };
  }

  private async buildAuthPayload(user: User) {
    const tenantId = user.getTenantId().getValue();
    const userId = user.getId().getValue();
    const roleIds = await this.roleAssignmentRepository.listRoleIdsForUser(
      tenantId,
      userId,
    );
    const roles = await this.roleRepository.findByIds(tenantId, roleIds);
    const permissions =
      await this.roleAssignmentRepository.listPermissionKeysForUser(
        tenantId,
        userId,
      );

    return {
      sub: userId,
      tenantId,
      email: user.getEmail().getValue(),
      roles: roles.map((role) => role.getName()),
      permissions,
    };
  }

  private refreshExpiryDate(): Date {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    return expires;
  }
}

@CommandHandler(LoginUserCommand)
export class LoginUserHandler
  implements ICommandHandler<LoginUserCommand, { accessToken: string; refreshToken: string }>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherPort,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenServicePort,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,
    @Inject(ROLE_ASSIGNMENT_REPOSITORY)
    private readonly roleAssignmentRepository: RoleAssignmentRepositoryPort,
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepositoryPort,
  ) {}

  async execute(
    command: LoginUserCommand,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = command;

    const user = await this.userRepository.findByEmailGlobal(email);
    if (!user || !user.getPasswordHash()) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const ok = await this.passwordHasher.compare(password, user.getPasswordHash() || '');
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = await this.buildAuthPayload(user);
    const accessToken = await this.tokenService.signAccessToken(payload);
    const refreshToken = await this.tokenService.signRefreshToken({
      sub: payload.sub,
      tenantId: payload.tenantId,
    });
    const refreshHash = await this.passwordHasher.hash(refreshToken);
    await this.refreshTokenRepository.saveHashedToken({
      tenantId: payload.tenantId,
      userId: payload.sub,
      tokenHash: refreshHash,
      expiresAt: this.refreshExpiryDate(),
    });

    return { accessToken, refreshToken };
  }

  private async buildAuthPayload(user: User) {
    const tenantId = user.getTenantId().getValue();
    const userId = user.getId().getValue();
    const roleIds = await this.roleAssignmentRepository.listRoleIdsForUser(
      tenantId,
      userId,
    );
    const roles = await this.roleRepository.findByIds(tenantId, roleIds);
    const permissions =
      await this.roleAssignmentRepository.listPermissionKeysForUser(
        tenantId,
        userId,
      );

    return {
      sub: userId,
      tenantId,
      email: user.getEmail().getValue(),
      roles: roles.map((role) => role.getName()),
      permissions,
    };
  }

  private refreshExpiryDate(): Date {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    return expires;
  }
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler
  implements ICommandHandler<RefreshTokenCommand, { accessToken: string; refreshToken: string }>
{
  constructor(
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenServicePort,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherPort,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(ROLE_ASSIGNMENT_REPOSITORY)
    private readonly roleAssignmentRepository: RoleAssignmentRepositoryPort,
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepositoryPort,
  ) {}

  async execute(
    command: RefreshTokenCommand,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = await this.tokenService.verifyRefreshToken<{
      sub: string;
      tenantId: string;
    }>(command.refreshToken);

    const storedHash = await this.refreshTokenRepository.findValidTokenHash(
      payload.tenantId,
      payload.sub,
    );
    if (!storedHash) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const matches = await this.passwordHasher.compare(
      command.refreshToken,
      storedHash,
    );
    if (!matches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userRepository.findById(payload.tenantId, payload.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const authPayload = await this.buildAuthPayload(user);
    const accessToken = await this.tokenService.signAccessToken(authPayload);
    const refreshToken = await this.tokenService.signRefreshToken({
      sub: authPayload.sub,
      tenantId: authPayload.tenantId,
    });
    const refreshHash = await this.passwordHasher.hash(refreshToken);
    await this.refreshTokenRepository.saveHashedToken({
      tenantId: authPayload.tenantId,
      userId: authPayload.sub,
      tokenHash: refreshHash,
      expiresAt: this.refreshExpiryDate(),
    });

    return { accessToken, refreshToken };
  }

  private async buildAuthPayload(user: User) {
    const tenantId = user.getTenantId().getValue();
    const userId = user.getId().getValue();
    const roleIds = await this.roleAssignmentRepository.listRoleIdsForUser(
      tenantId,
      userId,
    );
    const roles = await this.roleRepository.findByIds(tenantId, roleIds);
    const permissions =
      await this.roleAssignmentRepository.listPermissionKeysForUser(
        tenantId,
        userId,
      );

    return {
      sub: userId,
      tenantId,
      email: user.getEmail().getValue(),
      roles: roles.map((role) => role.getName()),
      permissions,
    };
  }

  private refreshExpiryDate(): Date {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    return expires;
  }
}

export const AUTH_HANDLERS = [
  RegisterUserHandler,
  LoginUserHandler,
  RefreshTokenHandler,
];
