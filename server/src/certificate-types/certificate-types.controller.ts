import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CertificateTypesService } from './certificate-types.service';
import { CreateCertificateTypeDto } from './dto/create-certificate-type.dto';
import { UpdateCertificateTypeDto } from './dto/update-certificate-type.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('certificate-types')
@Auth(Role.Admin)
export class CertificateTypesController {
  constructor(
    private readonly certificateTypesService: CertificateTypesService,
  ) {}

  @Post()
  create(@Body() createCertificateTypeDto: CreateCertificateTypeDto) {
    return this.certificateTypesService.create(createCertificateTypeDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.certificateTypesService.findAll(paginationDto);
  }

  @Get(':term')
  search(@Param('term') term: string, @Query() paginationDto: PaginationDto) {
    return this.certificateTypesService.search(term, paginationDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCertificateTypeDto: UpdateCertificateTypeDto,
  ) {
    return this.certificateTypesService.update(+id, updateCertificateTypeDto);
  }

  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.certificateTypesService.active(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.certificateTypesService.remove(+id);
  }
}
