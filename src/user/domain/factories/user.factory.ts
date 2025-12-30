import { User } from '../entities/user.entity';
import { userId, Email } from '../value-objects';

export type CreateUserInput = {
  name: string;
  email: string;
};

export type RehydrateUserInput = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export class UserFactory {
  static create(input: CreateUserInput): User {
    return User.create(input.name, input.email);
  }

  static rehydrate(input: RehydrateUserInput): User {
    return User.rehydrate({
      id: new userId(input.id),
      name: input.name,
      email: new Email(input.email),
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    });
  }
}