import { PermissionId } from '../value-objects';

export class Permission {
  constructor(
    private readonly id: PermissionId,
    private key: string,
    private description?: string,
    private readonly createdAt?: Date,
    private updatedAt?: Date,
  ) {}

  static create(key: string, description?: string) {
    if (!key || key.trim().length < 2) {
      throw new Error('Permission key must be at least 2 characters long');
    }
    return new Permission(new PermissionId(), key.trim(), description);
  }

  getId(): PermissionId {
    return this.id;
  }

  getKey(): string {
    return this.key;
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

  update(key?: string, description?: string) {
    if (key) {
      if (key.trim().length < 2) {
        throw new Error('Permission key must be at least 2 characters long');
      }
      this.key = key.trim();
    }
    if (description !== undefined) {
      this.description = description;
    }
    this.updatedAt = new Date();
  }
}
