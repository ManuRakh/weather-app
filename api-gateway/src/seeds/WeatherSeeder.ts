import { DataSource } from 'typeorm';
import { Weather } from '../utils/entities/weather.entity';

export class SeedWeatherData {
    public async run(dataSource: DataSource): Promise<void> {
      const weatherRepository = dataSource.getRepository(Weather);
        const weathers = [
            { city: 'New York', date: '2024-08-20', temperature: 29, condition: 'Sunny' },
            { city: 'Los Angeles', date: '2024-08-20', temperature: 25, condition: 'Cloudy' },
            { city: 'Chicago', date: '2024-08-20', temperature: 22, condition: 'Rainy' },
            { city: 'Houston', date: '2024-08-20', temperature: 30, condition: 'Sunny' },
            { city: 'Phoenix', date: '2024-08-20', temperature: 35, condition: 'Hot' },
            { city: 'Philadelphia', date: '2024-08-20', temperature: 24, condition: 'Windy' },
            { city: 'San Antonio', date: '2024-08-20', temperature: 28, condition: 'Sunny' },
            { city: 'San Diego', date: '2024-08-20', temperature: 26, condition: 'Cloudy' },
            { city: 'Dallas', date: '2024-08-20', temperature: 31, condition: 'Hot' },
            { city: 'San Jose', date: '2024-08-20', temperature: 27, condition: 'Sunny' },
        ];
        await weatherRepository.save(weathers);
    }
}
