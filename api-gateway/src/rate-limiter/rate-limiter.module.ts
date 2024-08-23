import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { RateLimiterService } from './rate-limiter.service';
import { RabbitMQModule } from 'src/rabbitmq/rabbitmq.module';

@Module({
    imports: [
    ConfigModule,
    CacheModule.register(),
    CacheModule.register({
        ttl: 10,
      }),
  ],
  providers: [RateLimiterService],
  exports: [RateLimiterService],
})
export class RateLimiterModule {}
