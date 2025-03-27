import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCertificateTypeDto } from './dto/create-certificate-type.dto';
import { UpdateCertificateTypeDto } from './dto/update-certificate-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CertificateType } from './entities/certificate-type.entity';
import { Repository } from 'typeorm';
import { formatCertificateTypeResponse } from './helpers/format-certificate-type-response.helper';
import { CertificateTypeResponse } from './interfaces/certificate-type-response.interface';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Paginated } from '../common/interfaces/paginated.interface';
import { BaseService } from 'src/common/services/base.service';

@Injectable()
export class CertificateTypesService extends BaseService<CertificateType> {
  constructor(
    @InjectRepository(CertificateType)
    private readonly certificateTypeRepository: Repository<CertificateType>,
  ) {
    super(certificateTypeRepository);
  }

  // Methods for endopoints
  async create(
    createCertificateTypeDto: CreateCertificateTypeDto,
  ): Promise<CertificateTypeResponse> {
    const certificateType = this.certificateTypeRepository.create(
      createCertificateTypeDto,
    );
    await this.certificateTypeRepository.save(certificateType);
    return formatCertificateTypeResponse(certificateType);
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<Paginated<CertificateTypeResponse>> {
    return this.findAllBase(
      paginationDto,
      'certificateType',
      formatCertificateTypeResponse,
      (queryBuilder) => {
        queryBuilder.orderBy('certificateType.createdAt', 'ASC');
      },
    );
  }

  async search(
    term: string,
    paginationDto: PaginationDto,
  ): Promise<Paginated<CertificateTypeResponse>> {
    return this.searchBase(
      term,
      paginationDto,
      'certificateType',
      formatCertificateTypeResponse,
      (queryBuilder, searchTerm) => {
        queryBuilder
          .where('certificateType.description LIKE :searchTerm', {
            searchTerm: `%${searchTerm}%`,
          })
          .orderBy('certificateType.createdAt', 'ASC');
      },
    );
  }

  async update(
    certificateTypeId: number,
    updateCertificateTypeDto: UpdateCertificateTypeDto,
  ) {
    const certificateType = await this.certificateTypeRepository.preload({
      certificateTypeId,
      ...updateCertificateTypeDto,
    });
    if (!certificateType || !certificateType.isActive)
      throw new NotFoundException(
        `Tipo de certificado con el ID ${certificateTypeId} no fue encontrado`,
      );
    await this.certificateTypeRepository.save(certificateType);
    return formatCertificateTypeResponse(certificateType);
  }

  async active(certificateTypeId: number): Promise<void> {
    const certificateType = await this.certificateTypeRepository.update(
      { certificateTypeId },
      { isActive: true },
    );
    if (certificateType.affected === 0)
      throw new NotFoundException(
        `Tipo de certificado con el ID ${certificateTypeId} no fue encontrado`,
      );
  }

  async remove(certificateTypeId: number): Promise<void> {
    const certificateType = await this.certificateTypeRepository.update(
      { certificateTypeId },
      { isActive: false },
    );
    if (certificateType.affected === 0)
      throw new NotFoundException(
        `Tipo de certificado con el ID ${certificateTypeId} no fue encontrado`,
      );
  }

  // Methods for internal helpers
  async findOne(certificateTypeId: number): Promise<CertificateType> {
    const certificateType = await this.certificateTypeRepository.findOne({
      where: { certificateTypeId },
    });
    if (!certificateType)
      throw new NotFoundException(
        `Tipo de certificado con el ID ${certificateTypeId} no fue encontrado`,
      );
    return certificateType;
  }

  async findAllIsActive(): Promise<CertificateTypeResponse[]> {
    const certificateTypes = await this.certificateTypeRepository.find({
      where: { isActive: true },
    });
    return certificateTypes.map(formatCertificateTypeResponse);
  }
}
