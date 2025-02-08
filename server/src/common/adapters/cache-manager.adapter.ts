import { Inject, Injectable } from '@nestjs/common';
import { CacheManager } from '../interfaces/cache-manager.interface';
import { RedisClientType } from 'redis';

@Injectable()
export class CacheManagerAdapter implements CacheManager {
  constructor(
    @Inject('REDIS_CLIENT')
    private redisClient: RedisClientType,
  ) {}

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.redisClient.set(key, JSON.stringify(value), {
      EX: ttl ? ttl : 60000,
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redisClient.get(key);
    return value ? JSON.parse(value) : null;
  }
}
