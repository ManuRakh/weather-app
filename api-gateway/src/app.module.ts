import { ConfigModule } from "@nestjs/config";
import { HealthModule } from "./health/health.module";
import { validate } from "./env.validator";
import { Module } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthModule } from "./auth/auth.module";
import { WeatherModule } from "./weather/weather.module";
import { RateLimiterModule } from "./rate-limiter/rate-limiter.module";
import { LoggerModule } from "nestjs-pino";

@Module({
  imports: [
    HealthModule, // for aws checking
    AuthModule,
    WeatherModule,
    RateLimiterModule,
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
  ],
})

@ApiTags("Api-gateway")
export class AppModule {}
