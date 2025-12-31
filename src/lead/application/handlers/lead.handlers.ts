import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryHandler, IQueryHandler, CommandBus } from '../../../shared/cqrs';
import { CreateLeadCommand, UpdateLeadCommand } from '../commands/lead.commands';
import { GetLeadQuery, ListLeadsQuery } from '../queries/lead.queries';
import { LEAD_REPOSITORY, LeadRepositoryPort } from '../ports';
import { Lead } from '../../domain/entities';
import { LogSystemActivityCommand } from '../../../activity/application/commands';

@CommandHandler(CreateLeadCommand)
export class CreateLeadHandler implements ICommandHandler<CreateLeadCommand, Lead> {
  constructor(
    @Inject(LEAD_REPOSITORY)
    private readonly leadRepository: LeadRepositoryPort,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: CreateLeadCommand): Promise<Lead> {
    const lead = Lead.create({
      tenantId: command.tenantId,
      name: command.name,
      email: command.email,
      phone: command.phone,
      source: command.source,
    });
    const saved = await this.leadRepository.create(lead);
    await this.commandBus.execute(
      new LogSystemActivityCommand(
        command.tenantId,
        null,
        'lead',
        saved.getId(),
        'lead_created',
        command.source ? `source:${command.source}` : undefined,
      ),
    );
    return saved;
  }
}

@CommandHandler(UpdateLeadCommand)
export class UpdateLeadHandler implements ICommandHandler<UpdateLeadCommand, Lead> {
  constructor(
    @Inject(LEAD_REPOSITORY)
    private readonly leadRepository: LeadRepositoryPort,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: UpdateLeadCommand): Promise<Lead> {
    const lead = await this.leadRepository.findById(command.tenantId, command.leadId);
    if (!lead) {
      throw new NotFoundException('Lead not found');
    }
    lead.update({
      name: command.name,
      email: command.email,
      phone: command.phone,
      status: command.status,
      source: command.source,
    });
    const saved = await this.leadRepository.update(lead);
    await this.commandBus.execute(
      new LogSystemActivityCommand(
        command.tenantId,
        null,
        'lead',
        saved.getId(),
        'lead_updated',
        command.status ? `status:${command.status}` : undefined,
      ),
    );
    return saved;
  }
}

@QueryHandler(GetLeadQuery)
export class GetLeadHandler implements IQueryHandler<GetLeadQuery, Lead> {
  constructor(
    @Inject(LEAD_REPOSITORY)
    private readonly leadRepository: LeadRepositoryPort,
  ) {}

  async execute(query: GetLeadQuery): Promise<Lead> {
    const lead = await this.leadRepository.findById(query.tenantId, query.leadId);
    if (!lead) {
      throw new NotFoundException('Lead not found');
    }
    return lead;
  }
}

@QueryHandler(ListLeadsQuery)
export class ListLeadsHandler implements IQueryHandler<ListLeadsQuery, Lead[]> {
  constructor(
    @Inject(LEAD_REPOSITORY)
    private readonly leadRepository: LeadRepositoryPort,
  ) {}

  async execute(query: ListLeadsQuery): Promise<Lead[]> {
    return this.leadRepository.list(query.tenantId);
  }
}

export const LEAD_HANDLERS = [
  CreateLeadHandler,
  UpdateLeadHandler,
  GetLeadHandler,
  ListLeadsHandler,
];
