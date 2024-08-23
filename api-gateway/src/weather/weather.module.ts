import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { WeatherService } from './weather.service';
import { DatabaseModule } from '../database/database.module';
import { WeatherController } from './weather.controller';
import { RateLimiterModule } from '../rate-limiter/rate-limiter.module';
import { HttpModule } from '@nestjs/axios';
import { Weather } from '../utils/entities/weather.entity';

@Module({
  imports: [
    HttpModule, RateLimiterModule,
    DatabaseModule,
    TypeOrmModule.forFeature([Weather]),
    CacheModule.register(),
  ],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
