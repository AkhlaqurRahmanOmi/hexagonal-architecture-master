import { RoleId } from '../value-objects';

export class Role {
  constructor(
    private readonly id: RoleId,
    private readonly tenantId: string,
    private name: string,
    private description?: string,
    private readonly createdAt?: Date,
    private updatedAt?: Date,
  ) {}

  static create(tenantId: string, name: string, description?: string) {
    if (!tenantId || tenantId.trim().length === 0) {
      throw new Error('TenantId is required');
    }
    if (!name || name.trim().length < 2) {
      throw new Error('Role name must be at least 2 characters long');
    }
    return new Role(new RoleId(), tenantId, name.trim(), description);
  }

  getId(): RoleId {
    return this.id;
  }

  getTenantId(): string {
    return this.tenantId;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string | undefined {
    return this.description;
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }

  update(name?: string, description?: string) {
    if (name) {
      if (name.trim().length < 2) {
        throw new Error('Role name must be at least 2 characters long');
      }
      this.name = name.trim();
    }
    if (description !== undefined) {
      this.description = description;
    }
    this.updatedAt = new Date();
  }
}
