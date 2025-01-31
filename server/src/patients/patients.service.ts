import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { TermRelationWithPerson } from 'src/persons/enum/term-relation.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { PersonService } from 'src/persons/person.service';
import { Person } from 'src/persons/entities/person.entity';
import { formatPatientResponse } from './helpers/format-patient-response.helper';
import { PatientResponse } from './interfaces/patient-response.interface';
import { paginate } from 'src/common/helpers/paginate.helper';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Paginated } from 'src/common/interfaces/paginated.interface';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    private readonly personService: PersonService,
    private readonly dataSource: DataSource
  ){}

  // Methods for endpoints
  async create(createPatientDto: CreatePatientDto): Promise<PatientResponse> {
    const { identityDocumentNumber, age } = createPatientDto;
    const termRelation = TermRelationWithPerson.patient;
    const person = await this.personService.isPersonRegistered({identityDocumentNumber, termRelation});
    if(person) return await this.isStaffRegistered(person, identityDocumentNumber);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let patient: Patient;
    try {
      patient = await this.createPatient(age, queryRunner);
      await this.personService.create({...createPatientDto, patient}, queryRunner);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
    const patientSaved = await this.findOne(patient.patientId);
    return formatPatientResponse(patientSaved);
  }

  async findAll(paginationDto: PaginationDto): Promise<Paginated<PatientResponse>> {
    const queryBuilder = this.patientRepository.createQueryBuilder('patient');
    queryBuilder
      .leftJoinAndSelect('patient.person', 'person')
      .where('isActive = true')
      .orderBy('patient.createdAt', 'ASC');
    const patients = await paginate(queryBuilder, paginationDto);
    return {
      ...patients,
      data: patients.data.map(formatPatientResponse)
    };
  }

  async search(term: string, paginationDto: PaginationDto): Promise<Paginated<PatientResponse>> {
    const searchTerm = `%${term}%`;
    const queryBuilder = this.patientRepository.createQueryBuilder('patient');
    queryBuilder
      .leftJoinAndSelect('patient.person', 'person')
      .where(
        'patient.isActive = true ' +
        'AND (person.identityDocumentNumber LIKE :searchTerm ' +
        'OR person.name LIKE :searchTerm ' +
        'OR person.paternalSurname LIKE :searchTerm ' +
        'OR person.maternalSurname LIKE :searchTerm ' +
        'OR patient.age LIKE :searchTerm)',
        { searchTerm })
      .orderBy('patient.createdAt', 'ASC');
    const patients = await paginate(queryBuilder, paginationDto);
    return {
      ...patients,
      data: patients.data.map(formatPatientResponse)
    };
  }

  async update(patientId: number, updatePatientDto: UpdatePatientDto): Promise<PatientResponse> {
    let patient = await this.findOne(patientId);
    const { age, ...updateDataPerson } = updatePatientDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      patient.age = age? age : patient.age;
      await queryRunner.manager.save(patient);
      const person = await this.personService.update(patient.person.personId, updateDataPerson, queryRunner);
      patient.person = person;
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
    return formatPatientResponse(patient);
  }

  async activate(patientId: number): Promise<void> {
    const patient = await this.patientRepository.update({patientId}, {isActive: true});
    if(patient.affected === 0) throw new NotFoundException(`El paciente no se encuentra registrado`);
  }

  async remove(patientId: number): Promise<void> {
    const patient = await this.patientRepository.update({patientId}, {isActive: false});
    if(patient.affected === 0) throw new NotFoundException(`El paciente no se encuentra registrado`);
  }
  
  // Internal helpers methods
  private async createPatient(age: number, queryRunner?: QueryRunner): Promise<Patient> {
    const repository = queryRunner? queryRunner.manager.getRepository(Patient) : this.patientRepository;
    const patient = repository.create({age});
    return await repository.save(patient);
  }

  private async findOne(patientId: number): Promise<Patient | null> {
    const patient = await this.patientRepository.findOne({where: {patientId}, relations: { person: true}});
    if(!patient) throw new NotFoundException(`El paciente no se encuentra registrado`);
    return patient;
  }

  private isStaffRegistered(person: Person, identityDocumentNumber: string): Promise<any> {
    const patient = person.patient;
    if(!patient) throw new BadRequestException(`Persona con DNI ${identityDocumentNumber} ya está registrada como personal`);
    if (!patient.isActive) throw new BadRequestException(`El paciente con DNI ${identityDocumentNumber} se encuentra desactivado`);
    throw new BadRequestException(`El paciente con DNI ${identityDocumentNumber} ya se encuentra registrado`);
  }
}
