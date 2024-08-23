import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RateLimiterService {
  private readonly limitPerSecond = 5;

  constructor(
    @Inject('CACHE_MANAGER') private readonly cacheManager: Cache,
      @Inject('NOTIFICATIONS_SERVICE') private client: ClientProxy,
  ) {}

  async checkLimit(userId: string) {
    const key = `rate-limit:${userId}`;
    const currentCount = (await this.cacheManager.get<number>(key)) || 0;

    if (currentCount >= this.limitPerSecond) {
      await this.sendLimitExceededNotification(userId, this.limitPerSecond);
      throw new UnauthorizedException('Rate limit exceeded');
    }

    await this.cacheManager.set(key, currentCount + 1, 1);
  }

  private async sendLimitExceededNotification(userId: string, userLimit: number) {
    const message = { userId, userLimit };
    await this.client.emit('notify_user', message).toPromise();
  }
}
