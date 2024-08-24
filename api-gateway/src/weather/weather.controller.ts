import { Controller, Get, Query, UseGuards, Req, Logger, HttpCode } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { RateLimiterGuard } from '../rate-limiter/rate-limiter.guard';
import { GetWeatherDto } from '../utils/dtos/weather/weather.dto';

@Controller('weather')
export class WeatherController {
  private readonly logger = new Logger(WeatherController.name);

  constructor(private readonly weatherService: WeatherService) {}

  @UseGuards(RateLimiterGuard)
  @HttpCode(200)
  @Get()
  async getWeather(@Query() query: GetWeatherDto, @Req() req) {
    const { city, date } = query;
    
    this.logger.log(`User ${req.user.sub} requested weather for ${city} on ${date}`);
    return this.weatherService.getWeather(city, date);
  }
}
