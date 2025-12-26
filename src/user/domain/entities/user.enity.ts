import { userId } from '../value-objects';
import { Email } from '../value-objects';

export class User {
  constructor(
    private readonly id: userId,
    private name : string,
    private email: Email,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {
  }


  static create(name: string, email: string) {
    if (!name || name.trim().length<2){
      throw new Error('Name must be at least 2 character long');
    }
    return new User(
      new userId(),
      name.trim(),
      new Email(email),
      new Date(),
      new Date()
    )
  }


  getId(): userId {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail() {
    return this.email;
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