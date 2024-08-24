import { Controller, Post, Body, UnauthorizedException, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from '../utils/dtos/user/login.dto';
import { CreateUserDto } from '../utils/dtos/user/user.dto';
import { User } from '../utils/entities/user.entity';
import { Public } from '../utils/decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @ApiBody({ type: LoginDto })
  @HttpCode(200)
  @Public()
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.login(loginDto);

    if (!token) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { accessToken: token };
  }

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBody({ type: CreateUserDto })
  @HttpCode(200)
  @Public()
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ user: User; token: string }> {   
      return this.authService.createUser(createUserDto);
  }
}
