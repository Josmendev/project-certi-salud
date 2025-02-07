import { Module } from '@nestjs/common';
import { UuidAdapter } from './adapters/uuid.adapter';
import { BcryptAdapter } from './adapters/bcrypt.adapter';
import { JwtAdapter } from './adapters/jwt.adapter';
import { JwtModule } from '@nestjs/jwt';
import { ApiFetchAdapter } from './adapters/api-fetch.adapter';
import { ConfigModule } from '@nestjs/config';
import { CacheManagerAdapter } from './adapters/cache-manager.adapter';

@Module({
  imports: [JwtModule, ConfigModule],
  exports: [UuidAdapter, BcryptAdapter, JwtAdapter, ApiFetchAdapter, CacheManagerAdapter],
  providers: [UuidAdapter, BcryptAdapter, JwtAdapter, ApiFetchAdapter, CacheManagerAdapter]
})
export class CommonModule {}
