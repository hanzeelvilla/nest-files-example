import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

type PostgresError = {
  code?: string;
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password: plainPassword, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(plainPassword, 10),
      });

      await this.userRepository.save(user);

      const { password, ...safeUser } = user;
      void password;

      return safeUser;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  handleDBExceptions(error: unknown): never {
    if (error instanceof QueryFailedError) {
      const pgError = error.driverError as PostgresError;

      if (pgError.code === '23505') {
        throw new BadRequestException('User already exists');
      }
    }

    throw new InternalServerErrorException('Unexpected error, check logs');
  }
}
