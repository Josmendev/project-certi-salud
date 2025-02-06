import { Module } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { CertificatesController } from './certificates.controller';
import { CommonModule } from 'src/common/common.module';
import { ReniecApiModule } from 'src/external-apis/reniec-api/reniec-api.module';

@Module({
  imports: [CommonModule, ReniecApiModule],
  controllers: [CertificatesController],
  providers: [CertificatesService],
})
export class CertificatesModule {}
