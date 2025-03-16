import { Injectable } from '@nestjs/common';
import { ValidateUserResponse } from 'src/auth/interfaces/validate-user-response.interface';
import { CertificatesService } from 'src/certificates/certificates.service';
import { CertificateResponse } from 'src/certificates/interfaces/certificate-response.interface';
import { PrinterService } from '../printer/printer.service';
import { getCertificateByIdReport } from './templates/certificate-by-id.report';
import { getImageAsDataURL } from '../helpers/get-image-as-data-url.helper';
import { PATH_LOGO_CERTI_SALUD } from './constants/constants';

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

  async generateReportById(certificateId: string): Promise<PDFKit.PDFDocument> {
    const certificate = await this.certificatesService.findOne(certificateId);
    console.log(certificate);
    const imageUrl = await getImageAsDataURL(PATH_LOGO_CERTI_SALUD);
    const docDefinition = getCertificateByIdReport(certificate, imageUrl);
    const doc = this.printerService.createPdf(docDefinition);
    return doc;
  }
}
