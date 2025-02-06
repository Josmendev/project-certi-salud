import { Controller, Get, Param, Query } from '@nestjs/common';
import { DiseasesService } from './diseases.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('diseases')
@Auth(Role.admin)
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
