import {
  BadRequestException,
  ConflictException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CommandHandler, ICommandHandler, QueryHandler, IQueryHandler } from '../../../shared/cqrs';
import {
  AddTenantMemberCommand,
  ActivateTenantCommand,
  CreateTenantCommand,
  DeactivateTenantCommand,
  RemoveTenantMemberCommand,
  UpdateTenantCommand,
  UpdateTenantMemberRoleCommand,
} from '../commands/tenant.commands';
import {
  GetTenantQuery,
  ListTenantMembersQuery,
  ListTenantsQuery,
  ListUserTenantsQuery,
} from '../queries/tenant.queries';
import {
  TENANT_REPOSITORY,
  TenantRepositoryPort,
  TENANT_MEMBERSHIP_REPOSITORY,
  TenantMembershipRepositoryPort,
} from '../ports';
import { Tenant, TenantMembership } from '../../domain/entities';

@CommandHandler(CreateTenantCommand)
export class CreateTenantHandler implements ICommandHandler<CreateTenantCommand, Tenant> {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: TenantRepositoryPort,
    @Inject(TENANT_MEMBERSHIP_REPOSITORY)
    private readonly membershipRepository: TenantMembershipRepositoryPort,
  ) {}

  async execute(command: CreateTenantCommand): Promise<Tenant> {
    const { name, ownerUserId } = command;
    if (!ownerUserId) {
      throw new BadRequestException('Owner user is required');
    }

    const existing = await this.tenantRepository.findByName(name);
    if (existing) {
      throw new ConflictException('Tenant already exists');
    }

    const tenant = Tenant.create(name);
    const created = await this.tenantRepository.create(tenant);

    const membership = TenantMembership.create(
      randomUUID(),
      created.getId().getValue(),
      ownerUserId,
      'admin',
    );
    await this.membershipRepository.create(membership);

    return created;
  }
}

@CommandHandler(UpdateTenantCommand)
export class UpdateTenantHandler implements ICommandHandler<UpdateTenantCommand, Tenant> {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: TenantRepositoryPort,
  ) {}

  async execute(command: UpdateTenantCommand): Promise<Tenant> {
    const tenant = await this.tenantRepository.findById(command.tenantId);
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    tenant.rename(command.name);
    return this.tenantRepository.update(tenant);
  }
}

@CommandHandler(ActivateTenantCommand)
export class ActivateTenantHandler implements ICommandHandler<ActivateTenantCommand, Tenant> {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: TenantRepositoryPort,
  ) {}

  async execute(command: ActivateTenantCommand): Promise<Tenant> {
    const tenant = await this.tenantRepository.findById(command.tenantId);
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    tenant.activate();
    return this.tenantRepository.update(tenant);
  }
}

@CommandHandler(DeactivateTenantCommand)
export class DeactivateTenantHandler implements ICommandHandler<DeactivateTenantCommand, Tenant> {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: TenantRepositoryPort,
  ) {}

  async execute(command: DeactivateTenantCommand): Promise<Tenant> {
    const tenant = await this.tenantRepository.findById(command.tenantId);
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    tenant.deactivate();
    return this.tenantRepository.update(tenant);
  }
}

@CommandHandler(AddTenantMemberCommand)
export class AddTenantMemberHandler
  implements ICommandHandler<AddTenantMemberCommand, TenantMembership>
{
  constructor(
    @Inject(TENANT_MEMBERSHIP_REPOSITORY)
    private readonly membershipRepository: TenantMembershipRepositoryPort,
  ) {}

  async execute(command: AddTenantMemberCommand): Promise<TenantMembership> {
    const existing = await this.membershipRepository.findByTenantAndUser(
      command.tenantId,
      command.userId,
    );
    if (existing) {
      throw new ConflictException('User already in tenant');
    }
    const membership = TenantMembership.create(
      randomUUID(),
      command.tenantId,
      command.userId,
      command.role,
    );
    return this.membershipRepository.create(membership);
  }
}

@CommandHandler(RemoveTenantMemberCommand)
export class RemoveTenantMemberHandler
  implements ICommandHandler<RemoveTenantMemberCommand, void>
{
  constructor(
    @Inject(TENANT_MEMBERSHIP_REPOSITORY)
    private readonly membershipRepository: TenantMembershipRepositoryPort,
  ) {}

  async execute(command: RemoveTenantMemberCommand): Promise<void> {
    await this.membershipRepository.remove(command.tenantId, command.userId);
  }
}

@CommandHandler(UpdateTenantMemberRoleCommand)
export class UpdateTenantMemberRoleHandler
  implements ICommandHandler<UpdateTenantMemberRoleCommand, void>
{
  constructor(
    @Inject(TENANT_MEMBERSHIP_REPOSITORY)
    private readonly membershipRepository: TenantMembershipRepositoryPort,
  ) {}

  async execute(command: UpdateTenantMemberRoleCommand): Promise<void> {
    await this.membershipRepository.updateRole(
      command.tenantId,
      command.userId,
      command.role,
    );
  }
}

@QueryHandler(GetTenantQuery)
export class GetTenantHandler implements IQueryHandler<GetTenantQuery, Tenant> {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: TenantRepositoryPort,
  ) {}

  async execute(query: GetTenantQuery): Promise<Tenant> {
    const tenant = await this.tenantRepository.findById(query.tenantId);
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    return tenant;
  }
}

@QueryHandler(ListTenantsQuery)
export class ListTenantsHandler implements IQueryHandler<ListTenantsQuery, Tenant[]> {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: TenantRepositoryPort,
  ) {}

  async execute(): Promise<Tenant[]> {
    return this.tenantRepository.list();
  }
}

@QueryHandler(ListTenantMembersQuery)
export class ListTenantMembersHandler
  implements IQueryHandler<ListTenantMembersQuery, TenantMembership[]>
{
  constructor(
    @Inject(TENANT_MEMBERSHIP_REPOSITORY)
    private readonly membershipRepository: TenantMembershipRepositoryPort,
  ) {}

  async execute(query: ListTenantMembersQuery): Promise<TenantMembership[]> {
    return this.membershipRepository.listByTenant(query.tenantId);
  }
}

@QueryHandler(ListUserTenantsQuery)
export class ListUserTenantsHandler
  implements IQueryHandler<ListUserTenantsQuery, TenantMembership[]>
{
  constructor(
    @Inject(TENANT_MEMBERSHIP_REPOSITORY)
    private readonly membershipRepository: TenantMembershipRepositoryPort,
  ) {}

  async execute(query: ListUserTenantsQuery): Promise<TenantMembership[]> {
    return this.membershipRepository.listByUser(query.userId);
  }
}

export const TENANT_HANDLERS = [
  CreateTenantHandler,
  UpdateTenantHandler,
  ActivateTenantHandler,
  DeactivateTenantHandler,
  AddTenantMemberHandler,
  RemoveTenantMemberHandler,
  UpdateTenantMemberRoleHandler,
  GetTenantHandler,
  ListTenantsHandler,
  ListTenantMembersHandler,
  ListUserTenantsHandler,
];
