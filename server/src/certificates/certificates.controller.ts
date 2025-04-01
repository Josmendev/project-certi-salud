import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { GetPersonByDniDto } from 'src/common/dto/get-person-by-dni.dto';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { ValidateUserResponse } from 'src/auth/interfaces/validate-user-response.interface';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('certificates')
@Auth(Role.Admin, Role.Register)
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

  @Get('certificate-types')
  getCertificateType() {
    return this.certificatesService.getCertificateType();
  }

  @Get('diseases')
  getDiseases(@Query() paginationDto: PaginationDto) {
    return this.certificatesService.getDiseases(paginationDto);
  }

  @Get('diseases/search/:term')
  searchDiseases(
    @Param('term') term: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.certificatesService.searchDiseases(term, paginationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.certificatesService.remove(id);
  }
}
