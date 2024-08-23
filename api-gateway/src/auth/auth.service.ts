import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { CreateUserDto } from '../utils/dtos/user/user.dto';
import { Result } from 'src/utils/types/resultObjectType';

@Injectable()
export class AuthService {
  private readonly authServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL');
  }

    async login(loginDto: any): Promise<Result> {
    const response = await this.httpService
      .post(`${this.authServiceUrl}/api/auth/login`, loginDto)
      .toPromise();

    return response.data;
    }
    
    async createUser(createUserDto: CreateUserDto): Promise<Result> {
        const response = await this.httpService
        .post(`${this.authServiceUrl}/api/auth/register`, createUserDto)
        .toPromise();
  
      return response.data;
  
    }
}
