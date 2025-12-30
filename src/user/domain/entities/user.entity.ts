import { userId, TenantId } from '../value-objects';
import { Email } from '../value-objects';

export class User {
  constructor(
    private readonly id: userId,
    private readonly tenantId: TenantId,
    private name : string,
    private email: Email,
    private readonly createdAt: Date,
    private updatedAt: Date,
    private readonly passwordHash?: string,
  ) {
  }


  static create(
    name: string,
    email: string,
    tenantId: string,
    passwordHash?: string,
  ) {
    if (!name || name.trim().length<2){
      throw new Error('Name must be at least 2 character long');
    }
    return new User(
      new userId(),
      new TenantId(tenantId),
      name.trim(),
      new Email(email),
      new Date(),
      new Date(),
      passwordHash,
    )
  }


  getId(): userId {
    return this.id;
  }

  getTenantId(): TenantId {
    return this.tenantId;
  }

  getName(): string {
    return this.name;
  }

  getEmail() {
    return this.email;
  }

  getPasswordHash(): string | undefined {
    return this.passwordHash;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpatedAt(): Date {
    return this.updatedAt;
  }

  updateName(name: string) {
    if (!name || name.trim().length > 2) {
      throw new Error('Name must be at least 2 characters long');
    }

    this.name = name;
    this.updatedAt = new Date();
  }

  updateEmail(email: string) {
    this.email = new Email(email);
    this.updatedAt = new Date();
  }

  getAccountAge(): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - this.createdAt.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
