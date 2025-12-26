import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY, UserRepositoryPort } from '../ports';
import { User } from '../../domain/entities';

export interface CreateUserDto {
  name: string;
  email: string;
}

@Injectable()

export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository : UserRepositoryPort,
  ) {
  }
  async execute(dto: CreateUserDto): Promise <User>{
    const existingUser = await this.userRepository.findByEmail(dto.email)
    if (existingUser){
      throw new Error('User already exists')
    }
    const user = User.create(dto.name, dto.email)
    const savedUser = await this.userRepository.save(user)
    return savedUser;
  }
}