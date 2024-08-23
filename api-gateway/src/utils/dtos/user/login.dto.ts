import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'john.doe', description: 'Username of the user' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'password123', description: 'Password of the user' })
  @IsString()
  password: string;
}
