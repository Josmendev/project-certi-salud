import { Module } from '@nestjs/common';
import { UuidAdapter } from './adapters/uuid.adapter';
import { BcryptAdapter } from './adapters/bcrypt.adapter';
import { JwtAdapter } from './adapters/jwt.adapter';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule
  ],
  exports: [UuidAdapter, BcryptAdapter, JwtAdapter],
  providers: [UuidAdapter, BcryptAdapter, JwtAdapter]
})
export class CommonModule {}
