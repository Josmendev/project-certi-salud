import { Module } from '@nestjs/common';
import { CertificatesReportsService } from './certificates-reports.service';
import { CertificatesReportsController } from './certificates-reports.controller';
import { CertificatesModule } from 'src/certificates/certificates.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [CertificatesModule, AuthModule],
  controllers: [CertificatesReportsController],
  providers: [CertificatesReportsService],
})
export class CertificatesReportsModule {}
