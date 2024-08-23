import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../utils/dtos/user/login.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from '../utils/dtos/user/user.dto';
import { User } from '../utils/entities/user.entity';
import { Public } from 'src/utils/decorators/public.decorator';
import { Result } from 'src/utils/types/resultObjectType';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @ApiBody({ type: LoginDto })
  @Public()
  @Post('login')
  async login(@Body() loginDto: any): Promise<Result> {
      const tokenInfo = await this.authService.login(loginDto);
      
    if (!tokenInfo) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return tokenInfo;
    }
    
    @ApiOperation({ summary: 'Register new user' })
    @ApiResponse({ status: 201, description: 'User successfully registered.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiBody({ type: CreateUserDto })
    @Public()
    @Post('register')
    async register(
      @Body() createUserDto: CreateUserDto,
    ): Promise<Result> {
      return this.authService.createUser(createUserDto);
    }
  
}
