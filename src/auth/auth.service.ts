import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { CreateUserDto, LoginUserDto } from './dto';

type PostgresError = {
  code?: string;
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
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

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();

    if (!user || !user.is_active)
      throw new UnauthorizedException('Not valid credentials');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Not valid credentials');

    const { password: userPassword, ...safeUser } = user;
    void userPassword;

    return {
      ...safeUser,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
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
