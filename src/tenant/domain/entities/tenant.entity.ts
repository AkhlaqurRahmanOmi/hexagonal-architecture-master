import { TenantId } from '../value-objects';

export type TenantStatus = 'active' | 'inactive';

export class Tenant {
  constructor(
    private readonly id: TenantId,
    private name: string,
    private status: TenantStatus,
    private readonly createdAt?: Date,
    private updatedAt?: Date,
  ) {}

  static create(name: string): Tenant {
    if (!name || name.trim().length < 2) {
      throw new Error('Tenant name must be at least 2 characters long');
    }
    return new Tenant(new TenantId(), name.trim(), 'active', new Date(), new Date());
  }

  getId(): TenantId {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getStatus(): TenantStatus {
    return this.status;
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }

  rename(name: string) {
    if (!name || name.trim().length < 2) {
      throw new Error('Tenant name must be at least 2 characters long');
    }
    this.name = name.trim();
    this.updatedAt = new Date();
  }

  activate() {
    this.status = 'active';
    this.updatedAt = new Date();
  }

  deactivate() {
    this.status = 'inactive';
    this.updatedAt = new Date();
  }
}
