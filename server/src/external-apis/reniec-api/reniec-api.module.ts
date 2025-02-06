import { Module } from '@nestjs/common';
import { ReniecApiService } from './reniec-api.service';
import { CommonModule } from 'src/common/common.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, CommonModule],
  exports: [ReniecApiService],
  providers: [ReniecApiService]
})
export class ReniecApiModule {}
