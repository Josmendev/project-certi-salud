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

@Injectable()
export class CertificatesService {
  constructor(
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
    private readonly certificateTypesService: CertificateTypesService,
    private readonly diseasesService: DiseasesService,
    private readonly staffService: StaffService,
    private readonly reniecApiService: ReniecApiService,
    private readonly personService: PersonService,
    private readonly patientService: PatientsService,
  ) {}

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
    return certificateCode;
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
  async find(user: ValidateUserResponse): Promise<CertificateResponse[]> {
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
