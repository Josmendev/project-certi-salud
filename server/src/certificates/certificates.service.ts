import { BadRequestException, Injectable } from '@nestjs/common';
import { ReniecApiService } from '../external-apis/reniec-api/reniec-api.service';
import { PersonByDniResponse } from 'src/common/interfaces/person-by-dni-response.interface';
import { GetPersonByDniDto } from 'src/common/dto/get-person-by-dni.dto';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certificate } from './entities/certificate.entity';
import { CertificateTypesService } from 'src/certificate-types/certificate-types.service';
import { PatientsService } from 'src/patients/patients.service';
import { CertificateTypesDescription } from './enums/certicate-types-description.enum';
import { ValidateUserResponse } from 'src/auth/interfaces/validate-user-response.interface';
import { StaffService } from 'src/staff/staff.service';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
    private readonly certificateTypesService: CertificateTypesService,
    private readonly patientsService: PatientsService,
    private readonly staffService: StaffService,
    private readonly reniecApiService: ReniecApiService,
  ) {}

  async create(
    createCertificateDto: CreateCertificateDto,
    user: ValidateUserResponse,
  ): Promise<any> {
    const { certificateTypeId, patientId, ...dataCertificate } =
      createCertificateDto;
    const [certificateType, patient, staff] = await Promise.all([
      this.certificateTypesService.findOne(certificateTypeId),
      this.patientsService.findOne(patientId),
      this.staffService.findOne(user.staffId),
    ]);
    if (
      certificateType.description === CertificateTypesDescription.MedicalRest &&
      !dataCertificate.restDays
    )
      throw new BadRequestException(
        'Debe especificar el número de días de descanso',
      );
    console.log(user);
    const certificate = this.certificateRepository.create({
      ...dataCertificate,
      certificateType,
      patient,
      staff,
    });
    await this.certificateRepository.save(certificate);
    return certificate;
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
}
