import { randomUUID } from 'node:crypto';

export type ActivityType = 'system' | 'note' | 'call' | 'email' | 'meeting';

export type EntityType = 'lead' | 'contact' | 'account' | 'deal';

export class Activity {
  constructor(
    private readonly id: string,
    private readonly tenantId: string,
    private readonly actorUserId: string | null,
    private readonly entityType: EntityType,
    private readonly entityId: string,
    private readonly type: ActivityType,
    private readonly createdAt?: Date,
  ) {}

  static create(params: {
    tenantId: string;
    actorUserId?: string | null;
    entityType: EntityType;
    entityId: string;
    type: ActivityType;
  }): Activity {
    if (!params.tenantId) {
      throw new Error('TenantId is required');
    }
    return new Activity(
      randomUUID(),
      params.tenantId,
      params.actorUserId ?? null,
      params.entityType,
      params.entityId,
      params.type,
      new Date(),
    );
  }

  getId(): string {
    return this.id;
  }

  getTenantId(): string {
    return this.tenantId;
  }

  getActorUserId(): string | null {
    return this.actorUserId;
  }

  getEntityType(): EntityType {
    return this.entityType;
  }

  getEntityId(): string {
    return this.entityId;
  }

  getType(): ActivityType {
    return this.type;
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt;
  }
}
