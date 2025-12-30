import { randomUUID } from 'node:crypto';

export class PermissionId {
  private readonly value: string;

  constructor(id?: string) {
    this.value = id || randomUUID();
  }

  getValue(): string {
    return this.value;
  }

  equals(other: PermissionId): boolean {
    return this.value === other.value;
  }
}
