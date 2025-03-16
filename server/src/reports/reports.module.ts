import { Module } from '@nestjs/common';
import { CertificatesReportsModule } from './certificates-reports/certificates-reports.module';
import { PrinterModule } from './printer/printer.module';
@Module({
  controllers: [],
  providers: [],
  imports: [CertificatesReportsModule, PrinterModule],
})
export class ReportsModule {}
