import { ConfigModule } from "@nestjs/config";
import { HealthModule } from "./health/health.module";
import { validate } from "./env.validator";
import { Module } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthModule } from "./auth/auth.module";
import { WeatherModule } from "./weather/weather.module";
import { RateLimiterModule } from "./rate-limiter/rate-limiter.module";
import { LoggerModule } from "nestjs-pino";
import { DatabaseModule } from "./database/database.module";
import { EmailModule } from "./notification/email.module";
import { RabbitMQModule } from "./rabbitmq/rabbitmq.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL,
        timestamp: () => `,"time":"${new Date().toISOString()}"`,
      },
    }),
    DatabaseModule,
    HealthModule, // for aws checking
    AuthModule,
    WeatherModule,
    EmailModule,
    RateLimiterModule,
    RabbitMQModule,
  ],
})

@ApiTags("Api-gateway")
export class AppModule {}
