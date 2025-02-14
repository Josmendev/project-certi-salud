import { Module } from '@nestjs/common';
import { UuidAdapter } from './adapters/uuid.adapter';
import { BcryptAdapter } from './adapters/bcrypt.adapter';
import { JwtAdapter } from './adapters/jwt.adapter';
import { JwtModule } from '@nestjs/jwt';
import { ApiFetchAdapter } from './adapters/api-fetch.adapter';
import { ConfigModule } from '@nestjs/config';
import { TransactionService } from './services/transaction.service';

@Module({
  imports: [JwtModule, ConfigModule],
  exports: [
    UuidAdapter,
    BcryptAdapter,
    JwtAdapter,
    ApiFetchAdapter,
    TransactionService,
  ],
  providers: [
    UuidAdapter,
    BcryptAdapter,
    JwtAdapter,
    ApiFetchAdapter,
    TransactionService,
  ],
})
export class CommonModule {}
