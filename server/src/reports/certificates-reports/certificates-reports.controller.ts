import { Controller, Get } from '@nestjs/common';
import { CertificatesReportsService } from './certificates-reports.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { ValidateUserResponse } from 'src/auth/interfaces/validate-user-response.interface';
import { Role } from 'src/auth/enums/role.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';

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
}
