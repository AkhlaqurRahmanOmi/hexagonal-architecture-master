import { Lead } from '../../domain/entities';

export interface LeadRepositoryPort {
  create(lead: Lead): Promise<Lead>;
  update(lead: Lead): Promise<Lead>;
  findById(tenantId: string, id: string): Promise<Lead | null>;
  list(tenantId: string): Promise<Lead[]>;
}

export const LEAD_REPOSITORY = Symbol('LEAD_REPOSITORY');
