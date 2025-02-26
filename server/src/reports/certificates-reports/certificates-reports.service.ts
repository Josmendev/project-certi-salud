import { Injectable } from '@nestjs/common';
import { ValidateUserResponse } from 'src/auth/interfaces/validate-user-response.interface';
import { CertificatesService } from 'src/certificates/certificates.service';
import { CertificateResponse } from 'src/certificates/interfaces/certificate-response.interface';

@Injectable()
export class CertificatesReportsService {
  constructor(private readonly certificatesService: CertificatesService) {}

  async find(user: ValidateUserResponse): Promise<CertificateResponse[]> {
    return this.certificatesService.find(user);
  }
}
