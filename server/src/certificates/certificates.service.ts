import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReniecApiService } from '../external-apis/reniec-api/reniec-api.service';
import { PersonByDniResponse } from 'src/common/interfaces/person-by-dni-response.interface';
import { GetPersonByDniDto } from 'src/common/dto/get-person-by-dni.dto';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certificate } from './entities/certificate.entity';
import { CertificateTypesService } from 'src/certificate-types/certificate-types.service';
import { CertificateTypesDescription } from './enums/certicate-types-description.enum';
import { ValidateUserResponse } from 'src/auth/interfaces/validate-user-response.interface';
import { StaffService } from 'src/staff/staff.service';
import { DiseasesService } from 'src/diseases/diseases.service';
import { Disease } from 'src/diseases/entities/disease.entity';
import { CertificateType } from 'src/certificate-types/entities/certificate-type.entity';
import { Staff } from 'src/staff/entities/staff.entity';
import { formatCertificateResponse } from './helpers/format-certificate-response.helper';
import { CertificateResponse } from './interfaces/certificate-response.interface';
import { StatusCertificate } from './enums/status-certificate.enum';
import { PersonService } from '../persons/person.service';
import { PatientsService } from 'src/patients/patients.service';
import { Patient } from 'src/patients/entities/patient.entity';
import { CreatePatientDto } from 'src/patients/dto/create-patient.dto';
import { Role } from 'src/auth/enums/role.enum';
import { CertificateTypeResponse } from 'src/certificate-types/interfaces/certificate-type-response.interface';
import { DiseaseResponse } from 'src/diseases/interfaces/disease-response.interface';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Paginated } from 'src/common/interfaces/paginated.interface';
import { BaseService } from 'src/common/services/base.service';

@Injectable()
export class CertificatesService extends BaseService<Certificate> {
  constructor(
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
    private readonly certificateTypesService: CertificateTypesService,
    private readonly diseasesService: DiseasesService,
    private readonly staffService: StaffService,
    private readonly reniecApiService: ReniecApiService,
    private readonly personService: PersonService,
    private readonly patientService: PatientsService,
  ) {
    super(certificateRepository);
  }

  // Methods for endpoints
  async create(
    createCertificateDto: CreateCertificateDto,
    user: ValidateUserResponse,
  ): Promise<CertificateResponse> {
    const {
      certificateTypeId,
      identityDocumentNumber,
      name,
      paternalSurname,
      maternalSurname,
      age,
      diseases,
      ...dataCertificate
    } = createCertificateDto;
    const createPatientDto = {
      identityDocumentNumber,
      name,
      paternalSurname,
      maternalSurname,
      age,
    };
    const certificateCode = await this.getCertificateByCode();
    const [certificateType, patient, staff] =
      await this.getRelationsForCertificate(
        certificateTypeId,
        createPatientDto,
        user.staffId,
      );
    let diseasesForCertificate: Disease[] = [];
    if (
      certificateType.description === CertificateTypesDescription.MedicalRest
    ) {
      this.validateMedicalRestCertificate(dataCertificate.restDays, diseases);
      diseasesForCertificate = await this.getDiseasesForCertificate(diseases);
    }
    if (
      certificateType.description === CertificateTypesDescription.GoodHealth
    ) {
      delete dataCertificate.restDays;
      diseasesForCertificate = [];
    }
    const certificate = this.certificateRepository.create({
      ...dataCertificate,
      certificateCode,
      certificateType,
      patient,
      staff,
      diseases: diseasesForCertificate,
    });
    await this.certificateRepository.save(certificate);
    return formatCertificateResponse(certificate);
  }

  async getPersonByDni(
    getPersonByDniDto: GetPersonByDniDto,
  ): Promise<PersonByDniResponse> {
    return await this.reniecApiService.getPersonByDni(getPersonByDniDto);
  }

  async getCertificateByCode(): Promise<string> {
    const [[{ certificate_code: certificateCode }]] =
      await this.certificateRepository.query('CALL GenerateCertificateCode()');
    if (!certificateCode)
      throw new NotFoundException('El código de certificado no existe');
    return certificateCode;
  }

  async getCertificateType(): Promise<CertificateTypeResponse[]> {
    return await this.certificateTypesService.findAllIsActive();
  }

  async getDiseases(
    paginationDto: PaginationDto,
  ): Promise<Paginated<DiseaseResponse>> {
    return await this.diseasesService.findAll(paginationDto);
  }

  async searchDiseases(
    term: string,
    paginationDto: PaginationDto,
  ): Promise<Paginated<DiseaseResponse>> {
    return await this.diseasesService.search(term, paginationDto);
  }

  async remove(certificateId: string): Promise<void> {
    const certificate = await this.certificateRepository.update(
      { certificateId },
      { status: StatusCertificate.Canceled },
    );
    if (certificate.affected === 0)
      throw new NotFoundException(
        `El certificado con el ID ${certificateId} no se encuentra registrado`,
      );
  }

  // Internal helper methods
  async find(
    user: ValidateUserResponse,
    paginationDto: PaginationDto,
  ): Promise<Paginated<CertificateResponse[]>> {
    const { role, staffId } = user;
    const isAdmin = role.includes(Role.Admin);
    return this.findAllBase(
      paginationDto,
      'certificate',
      formatCertificateResponse,
      (queryBuilder) => {
        queryBuilder
          .leftJoinAndSelect('certificate.certificateType', 'certificateType')
          .leftJoinAndSelect('certificate.patient', 'patient')
          .leftJoinAndSelect('patient.person', 'patientPerson')
          .leftJoinAndSelect('certificate.staff', 'staff')
          .leftJoinAndSelect('staff.person', 'staffPerson');
        queryBuilder.where('certificate.status = :status', {
          status: StatusCertificate.Completed,
        });

        if (!isAdmin) {
          queryBuilder.andWhere('certificate.staff.staffId = :staffId', {
            staffId,
          });
        }
        queryBuilder.orderBy('certificate.createdAt', 'ASC');
      },
    );
  }

  async search(
    term: string,
    user: ValidateUserResponse,
    paginationDto: PaginationDto,
  ): Promise<Paginated<CertificateResponse[]>> {
    const { role, staffId } = user;
    const isAdmin = role.includes(Role.Admin);
    return this.searchBase(
      term,
      paginationDto,
      'certificate',
      formatCertificateResponse,
      (queryBuilder, searchTerm) => {
        queryBuilder
          .leftJoinAndSelect('certificate.certificateType', 'certificateType')
          .leftJoinAndSelect('certificate.patient', 'patient')
          .leftJoinAndSelect('patient.person', 'patientPerson')
          .leftJoinAndSelect('certificate.staff', 'staff')
          .leftJoinAndSelect('staff.person', 'staffPerson')
          .where('certificate.status = :status', {
            status: StatusCertificate.Completed,
          })
          .andWhere('certificate.certificateCode LIKE :searchTerm ', {
            searchTerm: `%${searchTerm}%`,
          });
        if (!isAdmin) {
          queryBuilder.andWhere('certificate.staff.staffId = :staffId', {
            staffId,
          });
        }
        queryBuilder.orderBy('certificate.createdAt', 'ASC');
      },
    );
  }

  async findAllReports(
    user: ValidateUserResponse,
  ): Promise<CertificateResponse[]> {
    const { role, staffId } = user;
    const isAdmin = role.some((role) => role === Role.Admin);
    const whereCondition = isAdmin
      ? { status: StatusCertificate.Completed }
      : {
          staff: { staffId },
          status: StatusCertificate.Completed,
        };
    const certificates = await this.certificateRepository.find({
      where: whereCondition,
      order: { createdAt: 'ASC' },
      relations: {
        certificateType: true,
        patient: { person: true },
        staff: { person: true },
      },
    });
    return certificates.map(formatCertificateResponse);
  }

  async findOne(certificateId: string): Promise<CertificateResponse> {
    const certificate = await this.certificateRepository.findOne({
      where: { certificateId },
      relations: {
        certificateType: true,
        patient: { person: true },
        staff: { person: true },
      },
    });
    if (!certificate)
      throw new NotFoundException(
        `El certificado con el ID ${certificateId} no se encuentra registrado`,
      );
    return formatCertificateResponse(certificate);
  }

  private async getRelationsForCertificate(
    certificateTypeId: number,
    createPatientDto: CreatePatientDto,
    staffId: number,
  ): Promise<[CertificateType, Patient, Staff]> {
    return await Promise.all([
      this.certificateTypesService.findOne(certificateTypeId),
      this.getPersonForCertificate(createPatientDto),
      this.staffService.findOne(staffId),
    ]);
  }

  private async getPersonForCertificate(
    createPatientDto: CreatePatientDto,
  ): Promise<Patient> {
    const { identityDocumentNumber } = createPatientDto;
    const person = await this.personService.isPersonRegistered({
      identityDocumentNumber,
    });
    if (!person) {
      const newPatient = await this.patientService.create(createPatientDto);
      return await this.patientService.findOne(newPatient.patientId);
    }
    if (person.patient)
      return await this.patientService.findOne(identityDocumentNumber);
    if (person.staff) {
      const assignPatient =
        await this.patientService.assignPatient(createPatientDto);
      return await this.patientService.findOne(assignPatient.patientId);
    }
    throw new BadRequestException(`Error al determinar a la persona.`);
  }

  private async getDiseasesForCertificate(
    diseases: number[],
  ): Promise<Disease[]> {
    return await Promise.all(
      diseases.map(async (id) => this.diseasesService.findOne(+id)),
    );
  }

  private validateMedicalRestCertificate(
    restDays: number,
    diseases: number[],
  ): void {
    if (!restDays)
      throw new BadRequestException(
        'Debe especificar el número de días de descanso',
      );
    if (!diseases || diseases.length === 0)
      throw new BadRequestException(
        'Debe ingresar las enfermedades para establecer el diagnóstico',
      );
  }
}
