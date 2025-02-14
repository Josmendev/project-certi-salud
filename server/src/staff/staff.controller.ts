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
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { AssignStaffDto } from './dto/assing-staff.dto';

@Controller('staff')
@Auth(Role.admin)
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  create(@Body() createStaffDto: CreateStaffDto) {
    return this.staffService.create(createStaffDto);
  }

  @Post('assign')
  assignStaff(@Body() assignStaffDto: AssignStaffDto) {
    return this.staffService.assignStaff(assignStaffDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.staffService.findAll(paginationDto);
  }

  @Get(':term')
  search(@Param('term') term: string, @Query() paginationDto: PaginationDto) {
    return this.staffService.search(term, paginationDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto) {
    return this.staffService.update(+id, updateStaffDto);
  }

  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.staffService.activate(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffService.remove(+id);
  }
}
