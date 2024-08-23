import { Controller, Get, Query, UseGuards, Req, Logger } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { RateLimiterGuard } from '../rate-limiter/rate-limiter.guard';

@Controller('weather')
export class WeatherController {
  private readonly logger = new Logger(WeatherController.name);

  constructor(private readonly weatherService: WeatherService) {}

  @UseGuards(RateLimiterGuard)
  @Get()
  async getWeather(@Query('city') city: string, @Query('date') date: string, @Req() req) {
    this.logger.log(`User ${req.user.sub} requested weather for ${city} on ${date}`);
    return this.weatherService.getWeather(city, date);
  }
}
