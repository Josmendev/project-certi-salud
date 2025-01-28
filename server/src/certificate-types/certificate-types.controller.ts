import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CertificateTypesService } from './certificate-types.service';
import { CreateCertificateTypeDto } from './dto/create-certificate-type.dto';
import { UpdateCertificateTypeDto } from './dto/update-certificate-type.dto';

@Controller('certificate-types')
export class CertificateTypesController {
  constructor(private readonly certificateTypesService: CertificateTypesService) {}

  @Post()
  create(@Body() createCertificateTypeDto: CreateCertificateTypeDto) {
    return this.certificateTypesService.create(createCertificateTypeDto);
  }

  @Get()
  findAll() {
    return this.certificateTypesService.findAll();
  }

  @Get(':term')
  search(@Param('term') term: string) {
    return this.certificateTypesService.search(term);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCertificateTypeDto: UpdateCertificateTypeDto) {
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
