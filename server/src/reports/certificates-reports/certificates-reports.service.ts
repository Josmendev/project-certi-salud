import { Injectable } from '@nestjs/common';
import { ValidateUserResponse } from 'src/auth/interfaces/validate-user-response.interface';
import { CertificatesService } from 'src/certificates/certificates.service';
import { CertificateResponse } from 'src/certificates/interfaces/certificate-response.interface';
import { PrinterService } from '../printer/printer.service';
import { getCertificateByIdReport } from './reports/certificate-by-id.report';

@Injectable()
export class CertificatesReportsService {
  constructor(
    private readonly certificatesService: CertificatesService,
    private readonly printerService: PrinterService,
  ) {}

  async find(user: ValidateUserResponse): Promise<CertificateResponse[]> {
    return this.certificatesService.find(user);
  }

  async generateAllReport(): Promise<void> {
    // TODO: Generar reportes
  }

  async generateReportById(certificateId: string) {
    const docDefinition = getCertificateByIdReport(certificateId);
    const doc = this.printerService.createPdf(docDefinition);
    return doc;
  }
}
