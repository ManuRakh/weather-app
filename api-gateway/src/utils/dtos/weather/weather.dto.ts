import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidateIf } from 'class-validator';
import { validateFields } from '../../validate';

export class GetWeatherDto {
  @ValidateIf(weather => validateFields(weather, "Weather"))

  @ApiProperty({ example: 'New York', description: 'Name of city' })
  @IsString()
  city: string;

  @ApiProperty({ example: '2024-08-20', description: 'Assumed date' })
  @IsString()
  date: string;
}
