import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class WeatherService {
    private readonly weatherServiceUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
  ) {
    this.weatherServiceUrl = this.configService.get<string>('WEATHER_SERVICE_URL');
  }

  async getWeather(city: string, date: string) {
    const response = await this.httpService
      .get(`${this.weatherServiceUrl}/api/weather?city=${city}&date=${date}`)
      .toPromise();

    if (!response.data?.result) {
      throw new NotFoundException('Weather data not found');
    }

    return response.data;
  }
}
