import { Controller, Get, Param, Res } from '@nestjs/common';
import { CertificatesReportsService } from './certificates-reports.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { ValidateUserResponse } from 'src/auth/interfaces/validate-user-response.interface';
import { Role } from 'src/auth/enums/role.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Response } from 'express';

@Controller('certificates-reports')
@Auth(Role.Admin, Role.Register)
export class CertificatesReportsController {
  constructor(
    private readonly certificatesReportsService: CertificatesReportsService,
  ) {}

  @Get()
  find(@GetUser() user: ValidateUserResponse) {
    return this.certificatesReportsService.find(user);
  }

  @Get('generate-report/:id')
  async generateReportById(@Res() response: Response, @Param('id') id: string) {
    const pdfDoc = await this.certificatesReportsService.generateReportById(id);
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = 'Certificados';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
}
