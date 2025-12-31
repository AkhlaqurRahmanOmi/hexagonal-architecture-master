import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '../../shared/cqrs';
import { TenantId } from '../../shared/decorators/tenant-id.decorator';
import { TenantGuard } from '../../tenant/guards/tenant.guard';
import { CreateLeadCommand, UpdateLeadCommand } from '../application/commands/lead.commands';
import { GetLeadQuery, ListLeadsQuery } from '../application/queries/lead.queries';
import { CreateLeadDto, UpdateLeadDto } from '../dtos';
import { Lead } from '../domain/entities';

@Controller('leads')
@UseGuards(TenantGuard)
export class LeadController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(@TenantId() tenantId: string, @Body() dto: CreateLeadDto) {
    const command = new CreateLeadCommand(
      tenantId,
      dto.name,
      dto.email,
      dto.phone,
      dto.source,
    );
    const lead = await this.commandBus.execute<CreateLeadCommand, Lead>(command);
    return this.mapLead(lead);
  }

  @Get(':id')
  async get(@TenantId() tenantId: string, @Param('id') id: string) {
    const lead = await this.queryBus.execute<GetLeadQuery, Lead>(
      new GetLeadQuery(tenantId, id),
    );
    return this.mapLead(lead);
  }

  @Get()
  async list(@TenantId() tenantId: string) {
    const leads = await this.queryBus.execute<ListLeadsQuery, Lead[]>(
      new ListLeadsQuery(tenantId),
    );
    return leads.map((lead) => this.mapLead(lead));
  }

  @Patch(':id')
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateLeadDto,
  ) {
    const lead = await this.commandBus.execute<UpdateLeadCommand, Lead>(
      new UpdateLeadCommand(
        tenantId,
        id,
        dto.name,
        dto.email,
        dto.phone,
        dto.status,
        dto.source,
      ),
    );
    return this.mapLead(lead);
  }

  private mapLead(lead: Lead) {
    return {
      id: lead.getId(),
      tenantId: lead.getTenantId(),
      name: lead.getName(),
      email: lead.getEmail(),
      phone: lead.getPhone(),
      status: lead.getStatus(),
      source: lead.getSource(),
      createdAt: lead.getCreatedAt(),
      updatedAt: lead.getUpdatedAt(),
    };
  }
}
