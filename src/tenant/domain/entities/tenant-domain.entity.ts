export type DomainStatus = 'pending' | 'verified';

export class TenantDomain {
  constructor(
    private readonly id: string,
    private readonly tenantId: string,
    private domain: string,
    private status: DomainStatus,
    private readonly createdAt?: Date,
    private updatedAt?: Date,
  ) {}

  static create(id: string, tenantId: string, domain: string): TenantDomain {
    if (!tenantId) {
      throw new Error('TenantId is required');
    }
    if (!domain || domain.trim().length < 3) {
      throw new Error('Domain is required');
    }
    return new TenantDomain(id, tenantId, domain.trim().toLowerCase(), 'pending', new Date(), new Date());
  }

  getId(): string {
    return this.id;
  }

  getTenantId(): string {
    return this.tenantId;
  }

  getDomain(): string {
    return this.domain;
  }

  getStatus(): DomainStatus {
    return this.status;
  }

  verify() {
    this.status = 'verified';
    this.updatedAt = new Date();
  }
}
