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
      
      const staff = queryRunner.manager.create(Staff, {});
      await queryRunner.manager.save(staff);
      
      await this.personService.create({...createStaffDto, staff}, queryRunner);

      await this.userService.create({identityDocumentNumber, staff}, queryRunner);

      await queryRunner.commitTransaction();
      
      const staffSaved = await this.findOne(staff.staffId);
      return formatStaffResponse(staffSaved);

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<StaffResponse[]> {
    const staff = await this.staffRepository.find({where: {isActive: true}, relations: { person: true}});
    return staff.map(formatStaffResponse);
  }

  async findOne(staffId: number): Promise<Staff> {
    const staffSaved = await this.staffRepository.findOne({where: {staffId}, relations: { person: true}});
    return staffSaved;
  }

  update(id: number, updateStaffDto: UpdateStaffDto) {
    return `This action updates a #${id} staff`;
  }

  remove(id: number) {
    return `This action removes a #${id} staff`;
  }
}
