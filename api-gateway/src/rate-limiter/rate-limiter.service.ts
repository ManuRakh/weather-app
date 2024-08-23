import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ClientProxy } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RateLimiterService {
  private readonly limitPerSecond: number;
  private readonly logger: Logger;
  private readonly cacheTtl: number;
  private readonly requestsLimit: number;

  constructor(
    @Inject('CACHE_MANAGER') private readonly cacheManager: Cache,
    @Inject('NOTIFICATIONS_SERVICE') private client: ClientProxy,
    logger: Logger,
      private readonly configService: ConfigService,
  ) {
    this.logger = logger;
    this.limitPerSecond = this.configService.get<number>('limits_ttl');
    this.cacheTtl = this.configService.get<number>('cache_ttl');
    this.requestsLimit = this.configService.get<number>('requests_limit');
  }

  
  async checkLimit(userId: string) {
    const key = `rate-limit:${userId}`;
    const currentCount = (await this.cacheManager.get<number>(key)) || 0;

    if (currentCount >= this.limitPerSecond || currentCount > this.requestsLimit) {
      await this.sendLimitExceededNotification(userId, this.limitPerSecond);
      throw new UnauthorizedException('Rate limit exceeded');
    }

    await this.cacheManager.set(key, currentCount + 1, this.cacheTtl);
  }

  private async sendLimitExceededNotification(userId: string, userLimit: number) {
    try {
      const message = { userId, userLimit };
      this.client.emit('notify_user', message);
    } catch (error) {
      this.logger.error(error?.message);
    }

  }
}
