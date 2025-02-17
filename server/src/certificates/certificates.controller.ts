import { Body, Controller, Get, Post } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { GetPersonByDniDto } from 'src/common/dto/get-person-by-dni.dto';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { ValidateUserResponse } from 'src/auth/interfaces/validate-user-response.interface';

@Controller('certificates')
@Auth(Role.Admin)
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Post()
  create(
    @Body() createCertificateDto: CreateCertificateDto,
    @GetUser() user: ValidateUserResponse,
  ) {
    return this.certificatesService.create(createCertificateDto, user);
  }

  @Post('person/dni')
  getPersonByDni(@Body() getPersonByDniDto: GetPersonByDniDto) {
    return this.certificatesService.getPersonByDni(getPersonByDniDto);
  }

  @Get('certificate-code')
  getCertificateCode() {
    return this.certificatesService.getCertificateByCode();
  }
}
