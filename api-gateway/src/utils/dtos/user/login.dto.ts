import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidateIf } from 'class-validator';
import { validateFields } from '../../validate';

export class LoginDto {
  @ValidateIf(login => validateFields(login, "User"))
  @ApiProperty({ example: 'john.doe', description: 'Username of the user' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'password123', description: 'Password of the user' })
  @IsString()
  password: string;
}
