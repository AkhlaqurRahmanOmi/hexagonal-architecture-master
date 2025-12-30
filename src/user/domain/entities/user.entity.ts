import { userId } from '../value-objects';
import { Email } from '../value-objects';

type UserProps = {
  id: userId;
  name: string;
  email: Email;
  createdAt: Date;
  updatedAt: Date;
};

export class User {
  private constructor(private props: UserProps) {
  }

  static create(name: string, email: string) {
    if (!name || name.trim().length<2){
      throw new Error('Name must be at least 2 character long');
    }
    return new User({
      id: new userId(),
      name: name.trim(),
      email: new Email(email),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static rehydrate(props: UserProps): User {
    return new User(props);
  }

  getId(): userId {
    return this.props.id;
  }

  getName(): string {
    return this.props.name;
  }

  getEmail() {
    return this.props.email;
  }

  getCreatedAt(): Date {
    return this.props.createdAt;
  }

  getUpatedAt(): Date {
    return this.props.updatedAt;
  }

  updateName(name: string) {
    if (!name || name.trim().length > 2) {
      throw new Error('Name must be at least 2 characters long');
    }

    this.props.name = name;
    this.props.updatedAt = new Date();
  }

  updateEmail(email: string) {
    this.props.email = new Email(email);
    this.props.updatedAt = new Date();
  }

  getAccountAge(): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - this.props.createdAt.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}