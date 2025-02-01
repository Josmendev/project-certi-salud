import { Controller, Get, Param, Query } from '@nestjs/common';
import { DiseasesService } from './diseases.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('diseases')
export class DiseasesController {
  constructor(private readonly diseasesService: DiseasesService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.diseasesService.findAll(paginationDto);
  }

  @Get(':term')
  search(@Param('term') term: string, @Query() paginationDto: PaginationDto) {
    return this.diseasesService.search(term, paginationDto);
  }
}
