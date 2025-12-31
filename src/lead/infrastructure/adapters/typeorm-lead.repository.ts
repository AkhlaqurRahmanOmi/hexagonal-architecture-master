import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeadRepositoryPort } from '../../application/ports/lead.repository.port';
import { Lead } from '../../domain/entities';
import { LeadEntity } from './lead.orm-entity';

@Injectable()
export class TypeOrmLeadRepository implements LeadRepositoryPort {
  constructor(
    @InjectRepository(LeadEntity)
    private readonly leadRepository: Repository<LeadEntity>,
  ) {}

  async create(lead: Lead): Promise<Lead> {
    const entity = this.toEntity(lead);
    await this.leadRepository.save(entity);
    return lead;
  }

  async update(lead: Lead): Promise<Lead> {
    const entity = this.toEntity(lead);
    await this.leadRepository.save(entity);
    return lead;
  }

  async findById(tenantId: string, id: string): Promise<Lead | null> {
    const entity = await this.leadRepository.findOne({ where: { id, tenantId } });
    return entity ? this.toDomain(entity) : null;
  }

  async list(tenantId: string): Promise<Lead[]> {
    const entities = await this.leadRepository.find({ where: { tenantId } });
    return entities.map((entity) => this.toDomain(entity));
  }

  private toEntity(lead: Lead): LeadEntity {
    const entity = new LeadEntity();
    entity.id = lead.getId();
    entity.tenantId = lead.getTenantId();
    entity.name = lead.getName();
    entity.email = lead.getEmail() || null;
    entity.phone = lead.getPhone() || null;
    entity.status = lead.getStatus();
    entity.source = lead.getSource() || null;
    entity.createdAt = lead.getCreatedAt() || new Date();
    entity.updatedAt = lead.getUpdatedAt() || new Date();
    return entity;
  }

  private toDomain(entity: LeadEntity): Lead {
    return new Lead(
      entity.id,
      entity.tenantId,
      entity.name,
      entity.email || undefined,
      entity.phone || undefined,
      entity.status,
      entity.source || undefined,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
