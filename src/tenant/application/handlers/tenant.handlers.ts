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
  AddTenantDomainCommand,
  CreateTenantCommand,
  DeactivateTenantCommand,
  RemoveTenantMemberCommand,
  RemoveTenantDomainCommand,
  UpdateTenantCommand,
  UpdateTenantMemberRoleCommand,
  VerifyTenantDomainCommand,
} from '../commands/tenant.commands';
import {
  GetTenantQuery,
  ListTenantMembersQuery,
  ListTenantsQuery,
  ListUserTenantsQuery,
} from '../queries/tenant.queries';
import {
  ListTenantDomainsQuery,
  ResolveTenantByDomainQuery,
} from '../queries/tenant-domain.queries';
import {
  TENANT_REPOSITORY,
  TenantRepositoryPort,
  TENANT_MEMBERSHIP_REPOSITORY,
  TenantMembershipRepositoryPort,
  TENANT_DOMAIN_REPOSITORY,
  TenantDomainRepositoryPort,
} from '../ports';
import { Tenant, TenantMembership, TenantDomain } from '../../domain/entities';

@CommandHandler(CreateTenantCommand)
export class CreateTenantHandler implements ICommandHandler<CreateTenantCommand, Tenant> {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: TenantRepositoryPort,
    @Inject(TENANT_MEMBERSHIP_REPOSITORY)
    private readonly membershipRepository: TenantMembershipRepositoryPort,
    @Inject(TENANT_DOMAIN_REPOSITORY)
    private readonly domainRepository: TenantDomainRepositoryPort,
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

    const domain = TenantDomain.create(
      randomUUID(),
      created.getId().getValue(),
      `${created.getId().getValue()}.local`,
    );
    await this.domainRepository.create(domain);

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

@CommandHandler(AddTenantDomainCommand)
export class AddTenantDomainHandler
  implements ICommandHandler<AddTenantDomainCommand, TenantDomain>
{
  constructor(
    @Inject(TENANT_DOMAIN_REPOSITORY)
    private readonly domainRepository: TenantDomainRepositoryPort,
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: TenantRepositoryPort,
  ) {}

  async execute(command: AddTenantDomainCommand): Promise<TenantDomain> {
    const tenant = await this.tenantRepository.findById(command.tenantId);
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    const existing = await this.domainRepository.findByDomain(command.domain);
    if (existing) {
      throw new ConflictException('Domain already in use');
    }
    const domain = TenantDomain.create(
      randomUUID(),
      command.tenantId,
      command.domain,
    );
    return this.domainRepository.create(domain);
  }
}

@CommandHandler(VerifyTenantDomainCommand)
export class VerifyTenantDomainHandler
  implements ICommandHandler<VerifyTenantDomainCommand, void>
{
  constructor(
    @Inject(TENANT_DOMAIN_REPOSITORY)
    private readonly domainRepository: TenantDomainRepositoryPort,
  ) {}

  async execute(command: VerifyTenantDomainCommand): Promise<void> {
    await this.domainRepository.verify(command.tenantId, command.domainId);
  }
}

@CommandHandler(RemoveTenantDomainCommand)
export class RemoveTenantDomainHandler
  implements ICommandHandler<RemoveTenantDomainCommand, void>
{
  constructor(
    @Inject(TENANT_DOMAIN_REPOSITORY)
    private readonly domainRepository: TenantDomainRepositoryPort,
  ) {}

  async execute(command: RemoveTenantDomainCommand): Promise<void> {
    await this.domainRepository.remove(command.tenantId, command.domainId);
  }
}

@QueryHandler(ListTenantDomainsQuery)
export class ListTenantDomainsHandler
  implements IQueryHandler<ListTenantDomainsQuery, TenantDomain[]>
{
  constructor(
    @Inject(TENANT_DOMAIN_REPOSITORY)
    private readonly domainRepository: TenantDomainRepositoryPort,
  ) {}

  async execute(query: ListTenantDomainsQuery): Promise<TenantDomain[]> {
    return this.domainRepository.listByTenant(query.tenantId);
  }
}

@QueryHandler(ResolveTenantByDomainQuery)
export class ResolveTenantByDomainHandler
  implements IQueryHandler<ResolveTenantByDomainQuery, TenantDomain>
{
  constructor(
    @Inject(TENANT_DOMAIN_REPOSITORY)
    private readonly domainRepository: TenantDomainRepositoryPort,
  ) {}

  async execute(query: ResolveTenantByDomainQuery): Promise<TenantDomain> {
    const domain = await this.domainRepository.findByDomain(query.domain);
    if (!domain) {
      throw new NotFoundException('Tenant domain not found');
    }
    return domain;
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
  AddTenantDomainHandler,
  VerifyTenantDomainHandler,
  RemoveTenantDomainHandler,
  ListTenantDomainsHandler,
  ResolveTenantByDomainHandler,
];
