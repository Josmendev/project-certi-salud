import { Module } from '@nestjs/common';
import { UuidAdapter } from './adapters/uuid.adapter';
import { BcryptAdapter } from './adapters/bcrypt.adapter';

@Module({
  exports: [UuidAdapter, BcryptAdapter],
  providers: [UuidAdapter, BcryptAdapter]
})
export class CommonModule {}
