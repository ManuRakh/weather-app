import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from '../app.module';
import { Weather } from '../utils/entities/weather.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import generateRandomUUID from '../utils/uid.generator';

describe('WeatherModule (e2e)', () => {
  let app: INestApplication;
  let weatherRepository: Repository<Weather>;
  let accessToken: string;
  let cityName: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalGuards(app.get(JwtAuthGuard));

    await app.init();

    weatherRepository = moduleFixture.get<Repository<Weather>>(getRepositoryToken(Weather));

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'user1', password: 'password1' });

    accessToken = loginResponse.body.accessToken;
    cityName = generateRandomUUID();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await weatherRepository.delete({ city: cityName });
  });

  it('/weather (GET) should return weather data', async () => {
    const weatherData = weatherRepository.create({
      city: cityName,
      date: '2024-08-23',
      temperature: 25,
      condition: 'Sunny',
    });
    await weatherRepository.save(weatherData);

    const response = await request(app.getHttpServer())
      .get('/weather')
      .query({ city: cityName, date: '2024-08-23' })
      .set('authorization', accessToken);

    expect(response.body).toMatchObject({
      city: cityName,
      date: '2024-08-23',
      temperature: 25,
      condition: 'Sunny',
    });
  });

  it('/weather (GET) get Rate limit exceeded Error', async () => {
    const response = await request(app.getHttpServer())
      .get('/weather')
      .query({ city: 'UnknownCity', date: '2024-08-23' })
      .set('authorization', accessToken);
    
    expect(response.body).toEqual({
      "error": "Unauthorized",
      "message": "Rate limit exceeded",
      "statusCode": 401
    });
  });
});
