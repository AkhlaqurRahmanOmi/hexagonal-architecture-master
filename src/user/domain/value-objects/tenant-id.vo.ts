export class TenantId {
  private readonly value: string;

  constructor(id?: string) {
    if (!id || id.trim().length === 0) {
      throw new Error('TenantId is required');
    }
    this.value = id;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: TenantId) {
    return this.value === other.value;
  }
}
