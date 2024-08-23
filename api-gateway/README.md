## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## .env example
# Server port
PORT=3000

# Service URLs
AUTH_SERVICE_URL=http://localhost:3001
WEATHER_SERVICE_URL=http://localhost:3002

# RabbitMQ configuration
RABBITMQ_URL=amqp://localhost:5672
RABBITMQ_QUEUE=notifications_queue

# Logging level
LOG_LEVEL=info

# JWT secret key
JWT_SECRET=your_jwt_secret_key_here

# PostgreSQL database configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_postgres_password_here
POSTGRES_DATABASE=weather

# Gmail credentials
GMAIL_USER=your_gmail_user@gmail.com
GMAIL_PASS=your_gmail_password_here

# Limits
limits_ttl=5000
cache_ttl=5000
requests_limit=100

## Running the app

```bash
# watch mode
$ npm run start:dev
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e
```