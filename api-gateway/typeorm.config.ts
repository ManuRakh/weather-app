// typeorm.config.ts
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Weather } from './src/utils/entities/weather.entity';
import { User } from './src/utils/entities/user.entity';

import { config } from 'dotenv';

config();
const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get<string>('POSTGRES_HOST'),
  port: configService.get<number>('POSTGRES_PORT'),
  username: configService.get<string>('POSTGRES_USER'),
  password: configService.get<string>('POSTGRES_PASSWORD'),
  database: configService.get<string>('POSTGRES_DATABASE'),
  entities: [Weather, User],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
  migrationsRun: true, // can start migrations on start
});
