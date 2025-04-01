import { Injectable } from '@nestjs/common';
import { ValidateUserResponse } from 'src/auth/interfaces/validate-user-response.interface';
import { CertificatesService } from 'src/certificates/certificates.service';
import { CertificateResponse } from 'src/certificates/interfaces/certificate-response.interface';
import { PrinterService } from '../printer/printer.service';
import { getCertificateByIdReport } from './templates/certificate-by-id.template';
import { getImageAsDataURL } from '../helpers/get-image-as-data-url.helper';
import { PATH_LOGO_CERTI_SALUD } from './constants/constants';
import { getCertificateAllReport } from './templates/certificate-all.template';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Paginated } from 'src/common/interfaces/paginated.interface';

@Injectable()
export class CertificatesReportsService {
  constructor(
    private readonly certificatesService: CertificatesService,
    private readonly printerService: PrinterService,
  ) {}

  async find(
    user: ValidateUserResponse,
    paginationDto: PaginationDto,
  ): Promise<Paginated<CertificateResponse[]>> {
    return this.certificatesService.find(user, paginationDto);
  }

  async searchCertificates(
    term: string,
    user: ValidateUserResponse,
    paginationDto: PaginationDto,
  ): Promise<Paginated<CertificateResponse[]>> {
    return this.certificatesService.search(term, user, paginationDto);
  }

  async generateReportAll(
    user: ValidateUserResponse,
  ): Promise<PDFKit.PDFDocument> {
    const certificates = await this.certificatesService.findAllReports(user);
    const imageUrl = await getImageAsDataURL(PATH_LOGO_CERTI_SALUD);
    const docDefinition = getCertificateAllReport({ imageUrl, certificates });
    const doc = this.printerService.createPdf(docDefinition);
    return doc;
  }

  async generateReportOne(certificateId: string): Promise<PDFKit.PDFDocument> {
    const certificate = await this.certificatesService.findOne(certificateId);
    const imageUrl = await getImageAsDataURL(PATH_LOGO_CERTI_SALUD);
    const docDefinition = getCertificateByIdReport(certificate, imageUrl);
    const doc = this.printerService.createPdf(docDefinition);
    return doc;
  }
}
