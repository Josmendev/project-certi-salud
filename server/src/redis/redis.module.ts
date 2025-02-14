// src/redis/redis.module.ts
import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { REDIST_CLIENT } from './constants/contants';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    {
      provide: REDIST_CLIENT,
      useFactory: async (configService: ConfigService) => {
        const client = createClient({
          url: configService.get<string>('redis.url'),
        });
        await client.connect();
        return client;
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
