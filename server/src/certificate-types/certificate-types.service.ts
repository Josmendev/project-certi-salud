import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCertificateTypeDto } from './dto/create-certificate-type.dto';
import { UpdateCertificateTypeDto } from './dto/update-certificate-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CertificateType } from './entities/certificate-type.entity';
import { Repository } from 'typeorm';
import { formatCertificateTypeResponse } from './helpers/format-certificate-type-response.helper';
import { CertificateTypeResponse } from './interfaces/certificate-type-response.interface';

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

  async findAll(): Promise<CertificateTypeResponse[]> {
    const certificateTypes = await this.certificateTypeRepository.find({where: {isActive: true}});
    return certificateTypes.map(formatCertificateTypeResponse);
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
