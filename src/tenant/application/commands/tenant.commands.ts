import { ICommand } from '../../../shared/cqrs';
import { MembershipRole } from '../../domain/entities';

export class CreateTenantCommand implements ICommand {
  constructor(
    public readonly name: string,
    public readonly ownerUserId: string,
  ) {}
}

export class UpdateTenantCommand implements ICommand {
  constructor(public readonly tenantId: string, public readonly name: string) {}
}

export class ActivateTenantCommand implements ICommand {
  constructor(public readonly tenantId: string) {}
}

export class DeactivateTenantCommand implements ICommand {
  constructor(public readonly tenantId: string) {}
}

export class AddTenantMemberCommand implements ICommand {
  constructor(
    public readonly tenantId: string,
    public readonly userId: string,
    public readonly role: MembershipRole = 'member',
  ) {}
}

export class RemoveTenantMemberCommand implements ICommand {
  constructor(public readonly tenantId: string, public readonly userId: string) {}
}

export class UpdateTenantMemberRoleCommand implements ICommand {
  constructor(
    public readonly tenantId: string,
    public readonly userId: string,
    public readonly role: MembershipRole,
  ) {}
}

export class AddTenantDomainCommand implements ICommand {
  constructor(
    public readonly tenantId: string,
    public readonly domain: string,
  ) {}
}

export class VerifyTenantDomainCommand implements ICommand {
  constructor(
    public readonly tenantId: string,
    public readonly domainId: string,
  ) {}
}

export class RemoveTenantDomainCommand implements ICommand {
  constructor(
    public readonly tenantId: string,
    public readonly domainId: string,
  ) {}
}
