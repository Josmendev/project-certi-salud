import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff } from './entities/staff.entity';
import { QueryRunner, Repository } from 'typeorm';
import { PersonService } from 'src/persons/person.service';
import { UsersService } from 'src/users/users.service';
import { formatStaffResponse } from './helpers/format-staff-response.helper';
import { StaffResponse } from './interfaces/staff-response.interface';
import { Person } from 'src/persons/entities/person.entity';
import { TermRelationWithPerson } from 'src/persons/enum/term-relation.enum';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Paginated } from '../common/interfaces/paginated.interface';
import { BaseService } from 'src/common/services/base.service';
import { AssignStaffDto } from './dto/assing-staff.dto';
import { TransactionService } from 'src/common/services/transaction.service';

@Injectable()
export class StaffService extends BaseService<Staff> {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    private readonly userService: UsersService,
    private readonly personService: PersonService,
    private readonly transactionService: TransactionService,
  ) {
    super(staffRepository);
  }

  // Methods for endpoints
  async create(createStaffDto: CreateStaffDto): Promise<StaffResponse> {
    const { identityDocumentNumber } = createStaffDto;
    const termRelation = TermRelationWithPerson.staff;
    const person = await this.personService.isPersonRegistered({
      identityDocumentNumber,
      termRelation,
    });
    if (person) await this.isStaffRegistered(person);
    return await this.transactionService.runInTrasaction(
      async (queryRunner) => {
        const newPerson = await this.personService.create(
          { ...createStaffDto },
          queryRunner,
        );
        const staff = await this.createStaff(newPerson, queryRunner);
        await this.userService.create(
          { identityDocumentNumber, staff },
          queryRunner,
        );
        return formatStaffResponse(staff);
      },
    );
  }

  async assignStaff(assignStaffDto: AssignStaffDto): Promise<StaffResponse> {
    const { identityDocumentNumber } = assignStaffDto;
    const termRelation = TermRelationWithPerson.staff;
    const person = await this.personService.isPersonRegistered({
      identityDocumentNumber,
      termRelation,
    });
    if (!person)
      throw new NotFoundException(
        `La persona con DNI ${identityDocumentNumber} no está registrada`,
      );
    if (person.staff)
      throw new NotFoundException(
        `La persona con DNI ${identityDocumentNumber} ya es un personal`,
      );
    return await this.transactionService.runInTrasaction(
      async (queryRunner) => {
        const staff = await this.createStaff(person, queryRunner);
        await this.userService.create(
          { identityDocumentNumber, staff },
          queryRunner,
        );
        return formatStaffResponse(staff);
      },
    );
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<Paginated<StaffResponse>> {
    return this.findAllBase(
      paginationDto,
      'staff',
      formatStaffResponse,
      (queryBuilder) => {
        queryBuilder
          .leftJoinAndSelect('staff.person', 'person')
          .where('staff.isActive = true')
          .orderBy('staff.createdAt', 'ASC');
      },
    );
  }

  async search(
    term: string,
    paginationDto: PaginationDto,
  ): Promise<Paginated<StaffResponse>> {
    return this.searchBase(
      term,
      paginationDto,
      'staff',
      formatStaffResponse,
      (queryBuilder, searchTerm) => {
        queryBuilder
          .leftJoinAndSelect('staff.person', 'person')
          .where(
            'staff.isActive = true ' +
              'AND (person.identityDocumentNumber LIKE :searchTerm ' +
              'OR person.name LIKE :searchTerm ' +
              'OR person.paternalSurname LIKE :searchTerm ' +
              'OR person.maternalSurname LIKE :searchTerm)',
            { searchTerm: `%${searchTerm}%` },
          )
          .orderBy('staff.createdAt', 'ASC');
      },
    );
  }

  async update(
    staffId: number,
    updateStaffDto: UpdateStaffDto,
  ): Promise<StaffResponse> {
    const staff = await this.findOne(staffId);
    const person = await this.personService.update(
      staff.person.personId,
      updateStaffDto,
    );
    staff.person = person;
    return formatStaffResponse(staff);
  }

  async activate(staffId: number): Promise<void> {
    const staff = await this.findOne(staffId);
    await this.transactionService.runInTrasaction(async (queryRunner) => {
      staff.isActive = true;
      await Promise.all([
        queryRunner.manager.save(staff),
        this.userService.activate(staff, queryRunner),
      ]);
    });
  }

  async remove(staffId: number): Promise<void> {
    const staff = await this.findOne(staffId);
    await this.transactionService.runInTrasaction(async (queryRunner) => {
      staff.isActive = false;
      await Promise.all([
        queryRunner.manager.save(staff),
        this.userService.remove(staff, queryRunner),
      ]);
    });
  }

  // Internal helper methods
  private async createStaff(
    person: Person,
    queryRunner?: QueryRunner,
  ): Promise<Staff> {
    const repository = queryRunner
      ? queryRunner.manager.getRepository(Staff)
      : this.staffRepository;
    const staff = repository.create({
      person,
    });
    return repository.save(staff);
  }

  async findOne(staffId: number): Promise<Staff | null> {
    const staff = await this.staffRepository.findOne({
      where: { staffId },
      relations: { person: true },
    });
    if (!staff)
      throw new NotFoundException(`El personal no se encuentra registrado`);
    return staff;
  }

  private isStaffRegistered(person: Person): Promise<any> {
    const { staff, identityDocumentNumber } = person;
    if (!staff)
      throw new BadRequestException(
        `Persona con DNI ${identityDocumentNumber} ya está registrada como paciente`,
      );
    if (!staff.isActive)
      throw new BadRequestException([
        `El personal con DNI ${identityDocumentNumber} se encuentra desactivado`,
        staff.staffId,
      ]);
    throw new BadRequestException(
      `El personal con DNI ${identityDocumentNumber} ya se encuentra registrado`,
    );
  }
}
