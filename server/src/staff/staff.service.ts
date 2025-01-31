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
import { TermRelationWithPerson } from 'src/persons/enum/term-relation.enum';
import { paginate } from 'src/common/helpers/paginate.helper';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Paginated } from '../common/interfaces/paginated.interface';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    private readonly userService : UsersService,
    private readonly personService: PersonService,
    private readonly dataSource: DataSource
  ){}
  
  // Methods for endpoints
  async create(createStaffDto: CreateStaffDto): Promise<StaffResponse> {
    const { identityDocumentNumber } = createStaffDto;
    const termRelation = TermRelationWithPerson.staff;
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
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
    const staffSaved = await this.findOne(staff.staffId);
    return formatStaffResponse(staffSaved);
  }

  async findAll(paginationDto: PaginationDto): Promise<Paginated<StaffResponse>> {
    const queryBuilder = this.staffRepository.createQueryBuilder('staff');
    queryBuilder
      .leftJoinAndSelect('staff.person', 'person')
      .where('isActive = true')
      .orderBy('staff.createdAt', 'ASC');
    const staff = await paginate(queryBuilder, paginationDto);
    return {
      ...staff,
      data: staff.data.map(formatStaffResponse)
    };
  }

  async search(term: string, paginationDto: PaginationDto): Promise<Paginated<StaffResponse>> {
    const searchTerm = `%${term}%`;
    const queryBuilder = this.staffRepository.createQueryBuilder('staff');
    queryBuilder
      .leftJoinAndSelect('staff.person', 'person')
      .where(
        'staff.isActive = true ' +
        'AND (person.identityDocumentNumber LIKE :searchTerm ' +
        'OR person.name LIKE :searchTerm ' +
        'OR person.paternalSurname LIKE :searchTerm ' +
        'OR person.maternalSurname LIKE :searchTerm)',
        { searchTerm }
      )
      .orderBy('staff.createdAt', 'ASC');
    const staff = await paginate(queryBuilder, paginationDto);
    return {
      ...staff,
      data: staff.data.map(formatStaffResponse)
    };
  }

  async update(staffId: number, updateStaffDto: UpdateStaffDto): Promise<StaffResponse> {
    const staff = await this.findOne(staffId);
    const person = await this.personService.update(staff.person.personId, updateStaffDto);
    staff.person = person;
    return formatStaffResponse(staff);
  }

  async activate(staffId: number): Promise<void> {
    const staff = await this.findOne(staffId);
    const queryRunner = this.dataSource.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();
    try {
      staff.isActive = true;
      await Promise.all ([
        queryRunner.manager.save(staff),
        this.userService.activate(staff, queryRunner)
      ]);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(staffId: number): Promise<void> {
    const staff = await this.findOne(staffId);
    const queryRunner = this.dataSource.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();
    try {
      staff.isActive = false;
      await Promise.all ([
        queryRunner.manager.save(staff),
        this.userService.remove(staff, queryRunner)
      ]);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Internal helper methods
  private async createStaff (queryRunner?: QueryRunner): Promise<Staff> {
    const repository = queryRunner? queryRunner.manager.getRepository(Staff) : this.staffRepository;
    const staff = repository.create({});
    return repository.save(staff);
  }

  private async findOne(staffId: number): Promise<Staff | null> {
    const staff = await this.staffRepository.findOne({where: {staffId}, relations: { person: true}});
    if(!staff) throw new NotFoundException(`El personal no se encuentra registrado`);
    return staff;
  }

  private isStaffRegistered(person: Person, identityDocumentNumber: string): Promise<any> {
    const staff = person.staff;
    if(!staff) throw new BadRequestException(`Persona con DNI ${identityDocumentNumber} ya está registrada como paciente`);
    if (!staff.isActive) throw new BadRequestException(`El personal con DNI ${identityDocumentNumber} se encuentra desactivado`);
    throw new BadRequestException(`El personal con DNI ${identityDocumentNumber} ya se encuentra registrado`);
  }

}
