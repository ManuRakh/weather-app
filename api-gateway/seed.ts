import { SeedUsers } from './src/seeds/UsersSeeder';
import { SeedWeatherData } from './src/seeds/WeatherSeeder';

import AppDataSource from './typeorm.config';

AppDataSource.initialize()
  .then(async (dataSource) => {
    const seed = new SeedUsers();
    await seed.run(dataSource);

    const seedWeather = new SeedWeatherData();
    await seedWeather.run(dataSource);

    console.log('Seeding completed.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error during seeding:', err);
    process.exit(1);
  });
