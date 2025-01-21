import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff } from './entities/staff.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { PersonService } from 'src/persons/person.service';
import { UsersService } from 'src/users/users.service';
import { formatStaffResponse } from './helpers/format-staff-response.helper';
import { StaffResponse } from './interfaces/staff-response.interface';
import { Person } from 'src/persons/entities/person.entity';
import { TermRelation } from 'src/persons/enum/term-relation.enum';

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
    const termRelation = TermRelation.staff
    const person = await this.personService.isPersonRegistered({identityDocumentNumber, termRelation});
    if (person) await this.isStaffRegistered(person, identityDocumentNumber);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let staff: Staff;
    try {
      staff = await this.createStaff(queryRunner);
      await Promise.all([
        this.personService.create({...createStaffDto, staff}, queryRunner),
        this.userService.create({identityDocumentNumber, staff}, queryRunner)
      ]);
      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
    const staffSaved = await this.findOne(staff.staffId);
    return formatStaffResponse(staffSaved);
  }

  async createStaff (queryRunner?: QueryRunner): Promise<Staff> {
    const repository = queryRunner? queryRunner.manager.getRepository(Staff) : this.staffRepository;
    const staff = repository.create({});
    return repository.save(staff);
  }

  async findAll(): Promise<StaffResponse[]> {
    const staff = await this.staffRepository.find({where: {isActive: true}, relations: { person: true}});
    return staff.map(formatStaffResponse);
  }

  async findOne(staffId: number): Promise<Staff | null> {
    const staff = await this.staffRepository.findOne({where: {staffId}, relations: { person: true}});
    if(!staff) throw new NotFoundException(`El personal no se encuentra registrado`);
    return staff;
  }

  async update(personId: number, updateStaffDto: UpdateStaffDto): Promise<any> {
    const person = await this.personService.update(personId, updateStaffDto);
    return person;
  } 

  remove(id: number) {
    return `This action removes a #${id} staff`;
  }

  async isStaffRegistered(person: Person, identityDocumentNumber: string): Promise<any> {
    const staff = person.staff;
    if(!staff) throw new BadRequestException(`Persona con DNI ${identityDocumentNumber} ya está registrada como paciente`);
    if (!staff.isActive) throw new BadRequestException(`El personal con DNI ${identityDocumentNumber} se encuentra desactivado`);
    throw new BadRequestException(`El personal con DNI ${identityDocumentNumber} ya se encuentra registrado`);
  }

}
