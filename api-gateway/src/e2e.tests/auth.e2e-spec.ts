import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../app.module';
import { User } from '../utils/entities/user.entity';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
    let testUser: string;
    let testpassword: string;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

      userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
      testUser = 'testuser1';
      testpassword = 'testpassword';
  });

  afterAll(async () => {
    await app.close();
  });
  afterEach(async () => {
    await userRepository.delete({ username: testUser });
  });
  it('/auth/register (POST) should register a user and return a token', async () => {
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: testUser,
        password: testpassword,
      })

    expect(registerResponse.body).toHaveProperty('user');
    expect(registerResponse.body).toHaveProperty('token');
    expect(registerResponse.body.user.username).toBe(testUser);
  });

  it('/auth/login (POST) should log in a user and return a token', async () => {
    // Создание пользователя в базе данных
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(testpassword, salt);

    const user = userRepository.create({
      username: testUser,
      password: hashedPassword,
    });
    await userRepository.save(user);

    // Выполнение запроса на логин
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: testUser,
        password: testpassword,
      }).expect(200);

    expect(loginResponse.body).toHaveProperty('accessToken');
  });

  it('/auth/login (POST) should return invalid credentials', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: testUser,
        password: 'wrongpassword',
      })

    expect(loginResponse.body.message).toBe('Invalid credentials');
  });
});
