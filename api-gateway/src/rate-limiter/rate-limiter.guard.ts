import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { RateLimiterService } from './rate-limiter.service';

@Injectable()
export class RateLimiterGuard implements CanActivate {
  constructor(private readonly rateLimiterService: RateLimiterService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.sub;

    await this.rateLimiterService.checkLimit(userId);

    return true;
  }
}
