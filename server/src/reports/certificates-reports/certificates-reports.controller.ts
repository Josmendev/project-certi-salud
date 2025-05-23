import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { CertificatesReportsService } from './certificates-reports.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { ValidateUserResponse } from 'src/auth/interfaces/validate-user-response.interface';
import { Role } from 'src/auth/enums/role.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Response } from 'express';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('certificates-reports')
@Auth(Role.Admin, Role.Register)
export class CertificatesReportsController {
  constructor(
    private readonly certificatesReportsService: CertificatesReportsService,
  ) {}

  @Get()
  find(
    @GetUser() user: ValidateUserResponse,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.certificatesReportsService.find(user, paginationDto);
  }

  @Get('certificates/search/:term')
  searchCertificates(
    @Param('term') term: string,
    @GetUser() user: ValidateUserResponse,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.certificatesReportsService.searchCertificates(
      term,
      user,
      paginationDto,
    );
  }

  @Get('generate-report-one/:id')
  async generateReportById(@Res() response: Response, @Param('id') id: string) {
    const pdfDoc = await this.certificatesReportsService.generateReportOne(id);
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = 'Certificados';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('generate-report-all')
  async generateReportAll(
    @Res() response: Response,
    @GetUser() user: ValidateUserResponse,
  ) {
    const pdfDoc =
      await this.certificatesReportsService.generateReportAll(user);
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = 'Certificados';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
}
