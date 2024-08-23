import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ClientProxy } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';

@Injectable()
export class RateLimiterService {
  private readonly limitPerSecond = 1;
  private readonly logger: Logger;

  constructor(
    @Inject('CACHE_MANAGER') private readonly cacheManager: Cache,
    @Inject('NOTIFICATIONS_SERVICE') private client: ClientProxy,
      logger: Logger
  ) {
    this.logger = logger;
  }

  
  async checkLimit(userId: string) {
    const key = `rate-limit:${userId}`;
    const currentCount = (await this.cacheManager.get<number>(key)) || 0;

    if (currentCount >= this.limitPerSecond) {
      await this.sendLimitExceededNotification(userId, this.limitPerSecond);
      throw new UnauthorizedException('Rate limit exceeded');
    }

    await this.cacheManager.set(key, currentCount + 1, 10 * 1000);
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
