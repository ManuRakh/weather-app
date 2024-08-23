import { Module } from '@nestjs/common';
import { RateLimiterModule } from 'src/rate-limiter/rate-limiter.module';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, RateLimiterModule, ConfigModule],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
