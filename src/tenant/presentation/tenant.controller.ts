import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '../../shared/cqrs';
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
} from '../application/commands/tenant.commands';
import {
  GetTenantQuery,
  ListTenantMembersQuery,
  ListTenantsQuery,
  ListUserTenantsQuery,
} from '../application/queries/tenant.queries';
import { ListTenantDomainsQuery } from '../application/queries/tenant-domain.queries';
import {
  AddTenantMemberDto,
  CreateTenantDto,
  UpdateTenantDto,
  UpdateTenantMemberRoleDto,
  AddTenantDomainDto,
} from '../dtos';
import { Tenant } from '../domain/entities';
import { TenantGuard } from '../guards/tenant.guard';

@Controller('tenants')
export class TenantController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async createTenant(@Body() dto: CreateTenantDto) {
    const command = new CreateTenantCommand(dto.name, dto.ownerUserId);
    const tenant = await this.commandBus.execute<CreateTenantCommand, Tenant>(command);
    return {
      id: tenant.getId().getValue(),
      name: tenant.getName(),
      status: tenant.getStatus(),
      createdAt: tenant.getCreatedAt(),
      updatedAt: tenant.getUpdatedAt(),
    };
  }

  @Get()
  async listTenants() {
    return this.queryBus.execute(new ListTenantsQuery());
  }

  @Get(':tenantId')
  @UseGuards(TenantGuard)
  async getTenant(@Param('tenantId') tenantId: string) {
    return this.queryBus.execute(new GetTenantQuery(tenantId));
  }

  @Patch(':tenantId')
  @UseGuards(TenantGuard)
  async updateTenant(
    @Param('tenantId') tenantId: string,
    @Body() dto: UpdateTenantDto,
  ) {
    return this.commandBus.execute(new UpdateTenantCommand(tenantId, dto.name));
  }

  @Post(':tenantId/activate')
  @UseGuards(TenantGuard)
  async activateTenant(@Param('tenantId') tenantId: string) {
    return this.commandBus.execute(new ActivateTenantCommand(tenantId));
  }

  @Post(':tenantId/deactivate')
  @UseGuards(TenantGuard)
  async deactivateTenant(@Param('tenantId') tenantId: string) {
    return this.commandBus.execute(new DeactivateTenantCommand(tenantId));
  }

  @Get(':tenantId/members')
  @UseGuards(TenantGuard)
  async listMembers(@Param('tenantId') tenantId: string) {
    return this.queryBus.execute(new ListTenantMembersQuery(tenantId));
  }

  @Get(':tenantId/domains')
  @UseGuards(TenantGuard)
  async listDomains(@Param('tenantId') tenantId: string) {
    return this.queryBus.execute(new ListTenantDomainsQuery(tenantId));
  }

  @Post(':tenantId/domains')
  @UseGuards(TenantGuard)
  async addDomain(
    @Param('tenantId') tenantId: string,
    @Body() dto: AddTenantDomainDto,
  ) {
    return this.commandBus.execute(
      new AddTenantDomainCommand(tenantId, dto.domain),
    );
  }

  @Post(':tenantId/domains/:domainId/verify')
  @UseGuards(TenantGuard)
  async verifyDomain(
    @Param('tenantId') tenantId: string,
    @Param('domainId') domainId: string,
  ) {
    return this.commandBus.execute(
      new VerifyTenantDomainCommand(tenantId, domainId),
    );
  }

  @Delete(':tenantId/domains/:domainId')
  @UseGuards(TenantGuard)
  async removeDomain(
    @Param('tenantId') tenantId: string,
    @Param('domainId') domainId: string,
  ) {
    return this.commandBus.execute(
      new RemoveTenantDomainCommand(tenantId, domainId),
    );
  }

  @Post(':tenantId/members')
  @UseGuards(TenantGuard)
  async addMember(
    @Param('tenantId') tenantId: string,
    @Body() dto: AddTenantMemberDto,
  ) {
    return this.commandBus.execute(
      new AddTenantMemberCommand(tenantId, dto.userId, dto.role),
    );
  }

  @Patch(':tenantId/members/:userId/role')
  @UseGuards(TenantGuard)
  async updateMemberRole(
    @Param('tenantId') tenantId: string,
    @Param('userId') userId: string,
    @Body() dto: UpdateTenantMemberRoleDto,
  ) {
    return this.commandBus.execute(
      new UpdateTenantMemberRoleCommand(tenantId, userId, dto.role),
    );
  }

  @Delete(':tenantId/members/:userId')
  @UseGuards(TenantGuard)
  async removeMember(
    @Param('tenantId') tenantId: string,
    @Param('userId') userId: string,
  ) {
    return this.commandBus.execute(new RemoveTenantMemberCommand(tenantId, userId));
  }

  @Get('users/:userId')
  async listUserTenants(@Param('userId') userId: string) {
    return this.queryBus.execute(new ListUserTenantsQuery(userId));
  }
}
