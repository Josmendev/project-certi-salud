import { Module } from '@nestjs/common';
import { CertificatesReportsModule } from './certificates-reports/certificates-reports.module';
@Module({
  controllers: [],
  providers: [],
  imports: [CertificatesReportsModule],
})
export class ReportsModule {}
