import { randomUUID } from 'node:crypto';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'unqualified';

export class Lead {
  constructor(
    private readonly id: string,
    private readonly tenantId: string,
    private name: string,
    private email?: string,
    private phone?: string,
    private status: LeadStatus = 'new',
    private source?: string,
    private readonly createdAt?: Date,
    private updatedAt?: Date,
  ) {}

  static create(params: {
    tenantId: string;
    name: string;
    email?: string;
    phone?: string;
    source?: string;
  }): Lead {
    if (!params.tenantId) {
      throw new Error('TenantId is required');
    }
    if (!params.name || params.name.trim().length < 2) {
      throw new Error('Lead name must be at least 2 characters long');
    }
    return new Lead(
      randomUUID(),
      params.tenantId,
      params.name.trim(),
      params.email,
      params.phone,
      'new',
      params.source,
      new Date(),
      new Date(),
    );
  }

  getId(): string {
    return this.id;
  }

  getTenantId(): string {
    return this.tenantId;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string | undefined {
    return this.email;
  }

  getPhone(): string | undefined {
    return this.phone;
  }

  getStatus(): LeadStatus {
    return this.status;
  }

  getSource(): string | undefined {
    return this.source;
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }

  update(params: {
    name?: string;
    email?: string;
    phone?: string;
    status?: LeadStatus;
    source?: string;
  }) {
    if (params.name) {
      if (params.name.trim().length < 2) {
        throw new Error('Lead name must be at least 2 characters long');
      }
      this.name = params.name.trim();
    }
    if (params.email !== undefined) this.email = params.email;
    if (params.phone !== undefined) this.phone = params.phone;
    if (params.status) this.status = params.status;
    if (params.source !== undefined) this.source = params.source;
    this.updatedAt = new Date();
  }
}
