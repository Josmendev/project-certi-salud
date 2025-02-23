import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Disease } from './entities/disease.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { formatDiseaseResponse } from './helpers/format-disease-response.helper';
import { DiseaseResponse } from './interfaces/disease-response.interface';
import { Paginated } from 'src/common/interfaces/paginated.interface';
import { BaseService } from 'src/common/services/base.service';

@Injectable()
export class DiseasesService extends BaseService<Disease> {
  constructor(
    @InjectRepository(Disease)
    private readonly diseaseRepository: Repository<Disease>,
  ) {
    super(diseaseRepository);
  }

  // Methods for endpoints
  async findAll(
    paginationDto: PaginationDto,
  ): Promise<Paginated<DiseaseResponse>> {
    return this.findAllBase(
      paginationDto,
      'disease',
      formatDiseaseResponse,
      (queryBuilder) => {
        queryBuilder
          .where('isActive = true')
          .orderBy('disease.createdAt', 'ASC');
      },
    );
  }

  async search(
    term: string,
    paginationDto: PaginationDto,
  ): Promise<Paginated<DiseaseResponse>> {
    return this.searchBase(
      term,
      paginationDto,
      'disease',
      formatDiseaseResponse,
      (queryBuilder, searchTerm) => {
        queryBuilder
          .where('isActive = true')
          .andWhere('disease.description LIKE :searchTerm', {
            searchTerm: `%${searchTerm}%`,
          })
          .orderBy('disease.createdAt', 'ASC');
      },
    );
  }

  // Internal helper methods
  async findOne(diseaseId: number): Promise<Disease> {
    const disease = await this.diseaseRepository.findOne({
      where: { diseaseId },
    });
    if (!disease)
      throw new NotFoundException(
        `La enfermedad con el ID ${diseaseId} no se encuentra registrada`,
      );
    return disease;
  }
}
