import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { Weather } from '../utils/entities/weather.entity';

@Injectable()
export class WeatherService {
  constructor(
    @InjectRepository(Weather)
    private readonly weatherRepository: Repository<Weather>,
    @Inject('CACHE_MANAGER') private readonly cacheManager: Cache,
  ) {}

  async getWeather(city: string, date: string): Promise<Weather | null> {
    const cacheKey = `weather-${city}-${date}`;
    
    const cachedWeather = await this.cacheManager.get<Weather>(cacheKey);
    if (cachedWeather) {
      return cachedWeather;
    }

    const weather = await this.weatherRepository.findOne({ where: { city, date } });

    if (!weather) throw new NotFoundException("Weather information with the given data was not found")
    await this.cacheManager.set(cacheKey, weather, 3600);

    return weather;
  }
}
