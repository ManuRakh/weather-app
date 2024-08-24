import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidateIf } from 'class-validator';
import { validateFields } from '../../validate';

export class CreateUserDto {
  @ValidateIf(user => validateFields(user, "User"))

  @ApiProperty({ example: 'john.doe', description: 'Username of the user' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'password123', description: 'Password of the user' })
  @IsString()
  password: string;
}
