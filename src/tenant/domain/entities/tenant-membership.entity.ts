export type MembershipRole = 'admin' | 'member';
export type MembershipStatus = 'active' | 'inactive';

export class TenantMembership {
  constructor(
    private readonly id: string,
    private readonly tenantId: string,
    private readonly userId: string,
    private role: MembershipRole,
    private status: MembershipStatus,
    private readonly createdAt?: Date,
    private updatedAt?: Date,
  ) {}

  static create(
    id: string,
    tenantId: string,
    userId: string,
    role: MembershipRole = 'member',
  ): TenantMembership {
    if (!tenantId || !userId) {
      throw new Error('TenantId and UserId are required');
    }
    return new TenantMembership(
      id,
      tenantId,
      userId,
      role,
      'active',
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

  getUserId(): string {
    return this.userId;
  }

  getRole(): MembershipRole {
    return this.role;
  }

  getStatus(): MembershipStatus {
    return this.status;
  }

  setRole(role: MembershipRole) {
    this.role = role;
    this.updatedAt = new Date();
  }

  deactivate() {
    this.status = 'inactive';
    this.updatedAt = new Date();
  }
}
