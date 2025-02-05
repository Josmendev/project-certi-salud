import { Module } from '@nestjs/common';
import { ReniecApiModule } from './reniec-api/reniec-api.module';

@Module({
  imports: [ReniecApiModule]
})
export class ExternalApisModule {}
