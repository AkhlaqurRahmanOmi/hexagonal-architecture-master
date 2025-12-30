import { randomUUID } from 'node:crypto';

export class RoleId {
  private readonly value: string;

  constructor(id?: string) {
    this.value = id || randomUUID();
  }

  getValue(): string {
    return this.value;
  }

  equals(other: RoleId): boolean {
    return this.value === other.value;
  }
}
