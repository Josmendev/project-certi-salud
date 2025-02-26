import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { TermRelationWithPerson } from 'src/persons/enum/term-relation.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { QueryRunner, Repository } from 'typeorm';
import { PersonService } from 'src/persons/person.service';
import { Person } from 'src/persons/entities/person.entity';
import { formatPatientResponse } from './helpers/format-patient-response.helper';
import { PatientResponse } from './interfaces/patient-response.interface';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Paginated } from 'src/common/interfaces/paginated.interface';
import { BaseService } from 'src/common/services/base.service';
import { TransactionService } from '../common/services/transaction.service';
import { PatientDataDto } from './dto/patient-data.dto';
import { AssignPatientDto } from './dto/assign-patient.dto';

@Injectable()
export class PatientsService extends BaseService<Patient> {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    private readonly personService: PersonService,
    private readonly transactionService: TransactionService,
  ) {
    super(patientRepository);
  }

  // Methods for endpoints
  async create(createPatientDto: CreatePatientDto): Promise<PatientResponse> {
    const { age, ...personData } = createPatientDto;
    const identityDocumentNumber = personData.identityDocumentNumber;
    const termRelation = TermRelationWithPerson.patient;
    const person = await this.personService.isPersonRegistered({
      identityDocumentNumber,
      termRelation,
    });
    if (person) return await this.isPatientRegistered(person);
    return await this.transactionService.runInTrasaction(
      async (queryRunner) => {
        const person = await this.personService.create(
          { ...personData },
          queryRunner,
        );
        const patient = await this.createPatient({ age, person }, queryRunner);
        return formatPatientResponse(patient);
      },
    );
  }

  async assignPatient(
    assignPatientDto: AssignPatientDto,
  ): Promise<PatientResponse> {
    const { identityDocumentNumber, age } = assignPatientDto;
    const termRelation = TermRelationWithPerson.patient;
    const person = await this.personService.isPersonRegistered({
      identityDocumentNumber,
      termRelation,
    });
    if (!person)
      throw new NotFoundException(
        `La persona con DNI ${identityDocumentNumber} no está registrada`,
      );
    if (person.patient)
      throw new NotFoundException(
        `La persona con DNI ${identityDocumentNumber} ya es un paciente`,
      );
    const patient = await this.createPatient({ age, person });
    return formatPatientResponse(patient);
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<Paginated<PatientResponse>> {
    return this.findAllBase(
      paginationDto,
      'patient',
      formatPatientResponse,
      (queryBuilder) => {
        queryBuilder
          .leftJoinAndSelect('patient.person', 'person')
          .where('patient.isActive = true')
          .orderBy('patient.createdAt', 'ASC');
      },
    );
  }

  async search(
    term: string,
    paginationDto: PaginationDto,
  ): Promise<Paginated<PatientResponse>> {
    return this.searchBase(
      term,
      paginationDto,
      'patient',
      formatPatientResponse,
      (queryBuilder, searchTerm) => {
        queryBuilder
          .leftJoinAndSelect('patient.person', 'person')
          .where(
            'patient.isActive = true ' +
              'AND (person.identityDocumentNumber LIKE :searchTerm ' +
              'OR person.name LIKE :searchTerm ' +
              'OR person.paternalSurname LIKE :searchTerm ' +
              'OR person.maternalSurname LIKE :searchTerm ' +
              'OR patient.age LIKE :searchTerm)',
            { searchTerm: `%${searchTerm}%` },
          )
          .orderBy('patient.createdAt', 'ASC');
      },
    );
  }

  async update(
    patientId: number,
    updatePatientDto: UpdatePatientDto,
  ): Promise<PatientResponse> {
    const patient = await this.findOne(patientId);
    const { age, ...updateDataPerson } = updatePatientDto;
    patient.age = age ? age : patient.age;
    return this.transactionService.runInTrasaction(async (queryRunner) => {
      await queryRunner.manager.save(patient);
      const person = await this.personService.update(
        patient.person.personId,
        updateDataPerson,
        queryRunner,
      );
      patient.person = person;
      return formatPatientResponse(patient);
    });
  }

  async activate(patientId: number): Promise<void> {
    const patient = await this.patientRepository.update(
      { patientId },
      { isActive: true },
    );
    if (patient.affected === 0)
      throw new NotFoundException(`El paciente no se encuentra registrado`);
  }

  async remove(patientId: number): Promise<void> {
    const patient = await this.patientRepository.update(
      { patientId },
      { isActive: false },
    );
    if (patient.affected === 0)
      throw new NotFoundException(`El paciente no se encuentra registrado`);
  }

  // Internal helpers methods
  async createPatient(
    patientDataDto: PatientDataDto,
    queryRunner?: QueryRunner,
  ): Promise<Patient> {
    const repository = queryRunner
      ? queryRunner.manager.getRepository(Patient)
      : this.patientRepository;
    const patient = repository.create(patientDataDto);
    return await repository.save(patient);
  }

  async findOne(term: number | string): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where:
        typeof term === 'number'
          ? { patientId: term }
          : { person: { identityDocumentNumber: term } },
      relations: { person: true },
    });
    if (!patient) {
      throw new NotFoundException(`El paciente no se encuentra registrado`);
    }
    return patient;
  }

  private isPatientRegistered(person: Person): Promise<any> {
    const { patient, identityDocumentNumber } = person;
    if (!patient)
      throw new BadRequestException(
        `Persona con DNI ${identityDocumentNumber} ya está registrada como personal`,
      );
    if (!patient.isActive)
      throw new BadRequestException(
        `El paciente con DNI ${identityDocumentNumber} se encuentra desactivado`,
      );
    throw new BadRequestException(
      `El paciente con DNI ${identityDocumentNumber} ya se encuentra registrado`,
    );
  }
}
