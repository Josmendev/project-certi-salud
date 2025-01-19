import { Injectable } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff } from './entities/staff.entity';
import { DataSource, Repository } from 'typeorm';
import { PersonService } from 'src/persons/person.service';
import { UsersService } from 'src/users/users.service';
import { formatStaffResponse } from './helpers/format-staff-response.helper';
import { StaffResponse } from './interfaces/staff-response.interface';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    private readonly userService : UsersService,
    private readonly personService: PersonService,
    private readonly dataSource: DataSource
  ){}
  async create(createStaffDto: CreateStaffDto): Promise<StaffResponse> {
    
    const { identityDocumentNumber } = createStaffDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.personService.validatePersonAndStaff(identityDocumentNumber);
      
      const staff = this.staffRepository.create({});
      await queryRunner.manager.save(staff);
      
      const personStaff = await this.personService.create({...createStaffDto, staff});
      await queryRunner.manager.save(personStaff);

      const user = await this.userService.create({identityDocumentNumber, staff});
      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();
      
      return formatStaffResponse(personStaff);

    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    const staff = await this.staffRepository.find({where: {isActive: true}});
    return staff;
  }

  findOne(id: number) {
    return `This action returns a #${id} staff`;
  }

  update(id: number, updateStaffDto: UpdateStaffDto) {
    return `This action updates a #${id} staff`;
  }

  remove(id: number) {
    return `This action removes a #${id} staff`;
  }
}
