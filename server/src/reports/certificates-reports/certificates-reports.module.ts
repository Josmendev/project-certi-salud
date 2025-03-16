import { Module } from '@nestjs/common';
import { CertificatesReportsService } from './certificates-reports.service';
import { CertificatesReportsController } from './certificates-reports.controller';
import { CertificatesModule } from 'src/certificates/certificates.module';
import { AuthModule } from 'src/auth/auth.module';
import { PrinterModule } from '../printer/printer.module';

@Module({
  imports: [CertificatesModule, AuthModule, PrinterModule],
  controllers: [CertificatesReportsController],
  providers: [CertificatesReportsService],
})
export class CertificatesReportsModule {}
