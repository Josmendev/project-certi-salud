import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCertificateTypeDto } from './dto/create-certificate-type.dto';
import { UpdateCertificateTypeDto } from './dto/update-certificate-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CertificateType } from './entities/certificate-type.entity';
import { Repository } from 'typeorm';
import { formatCertificateTypeResponse } from './helpers/format-certificate-type-response.helper';
import { CertificateTypeResponse } from './interfaces/certificate-type-response.interface';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { paginated } from '../common/interfaces/paginated.interface';
import { paginate } from 'src/common/helpers/paginate.helper';

@Injectable()
export class CertificateTypesService {
  constructor(
    @InjectRepository(CertificateType)
    private readonly certificateTypeRepository: Repository<CertificateType>
  ){}

  // Methods for endopoints
  async create(createCertificateTypeDto: CreateCertificateTypeDto): Promise<CertificateTypeResponse> {
    const certificateType = this.certificateTypeRepository.create(createCertificateTypeDto);
    await this.certificateTypeRepository.save(certificateType);
    return formatCertificateTypeResponse(certificateType);
  }

  async findAll(paginationDto: PaginationDto): Promise<paginated<CertificateTypeResponse>> {
    const queryBuilder = this.certificateTypeRepository.createQueryBuilder('certificate_type')
      .where('isActive = true')
      .orderBy('certificate_type.createdAt', 'ASC')
    const certificateTypes = await paginate(queryBuilder, paginationDto);
    return {
      ...certificateTypes,
      data: certificateTypes.data.map(formatCertificateTypeResponse)
    }
  }

  async search(term: string): Promise<CertificateTypeResponse[]> {
    const queryBuilder = this.certificateTypeRepository.createQueryBuilder('role');
    const searchTerm = `%${term.toLowerCase()}%`;
    const certificateTypes = await queryBuilder
      .where('isActive = true AND LOWER(description) LIKE :searchTerm', {searchTerm})
      .getMany();
    return certificateTypes.map(formatCertificateTypeResponse);
  }

  async update(certificateTypeId: number, updateCertificateTypeDto: UpdateCertificateTypeDto) {
    const certificateType = await this.certificateTypeRepository.preload({
      certificateTypeId,
      ...updateCertificateTypeDto
    });
    if(!certificateType || !certificateType.isActive) throw new NotFoundException(`Tipo de certificado con el ID ${certificateTypeId} no fue encontrado`);
    await this.certificateTypeRepository.save(certificateType);
    return formatCertificateTypeResponse(certificateType);
  }

  async active(certificateTypeId: number): Promise<void> {
    const certificateType = await this.certificateTypeRepository.update({certificateTypeId},{isActive: true});
    if(certificateType.affected === 0) throw new NotFoundException(`Tipo de certificado con el ID ${certificateTypeId} no fue encontrado`);
  }

  async remove(certificateTypeId: number): Promise<void> {
    const certificateType = await this.certificateTypeRepository.update({certificateTypeId},{isActive: false});
    if(certificateType.affected === 0) throw new NotFoundException(`Tipo de certificado con el ID ${certificateTypeId} no fue encontrado`);
  }

}
