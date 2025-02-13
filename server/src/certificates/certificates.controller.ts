import { Body, Controller, Post } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { GetPersonByDniDto } from 'src/common/dto/get-person-by-dni.dto';

@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Post('person/dni')
  getPersonByDni(@Body() getPersonByDniDto: GetPersonByDniDto) {
    return this.certificatesService.getPersonByDni(getPersonByDniDto);
  }
}
