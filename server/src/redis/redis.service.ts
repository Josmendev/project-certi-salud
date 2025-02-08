import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { REDIST_CLIENT } from './constants/contants';

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIST_CLIENT)
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
