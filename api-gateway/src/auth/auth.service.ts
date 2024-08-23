import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../utils/dtos/user/login.dto';
import { User } from '../utils/entities/user.entity';
import { CreateUserDto } from '../utils/dtos/user/user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<string | null> {
    const { username, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { username: user.username, sub: user.id };
      return this.jwtService.sign(payload);
    }

    return null;
  }

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<{ user: User; token: string }> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    const payload = { username: savedUser.username, sub: savedUser.id };
    const token = this.jwtService.sign(payload);

    return { user: savedUser, token };
  }
}
