import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Disease } from './entities/disease.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { paginate } from 'src/common/helpers/paginate.helper';
import { formatDiseaseResponse } from './helpers/format-disease-response.helper';
import { DiseaseResponse } from './interfaces/disease-response.interface';
import { Paginated } from 'src/common/interfaces/paginated.interface';
import { BaseService } from 'src/common/services/base.service';

@Injectable()
export class DiseasesService extends BaseService<Disease> {
  constructor(
    @InjectRepository(Disease)
    private readonly diseaseRepository: Repository<Disease>
  ){
    super(diseaseRepository)
  }

  // Methods for endpoints
  async findAll(paginationDto: PaginationDto): Promise<Paginated<DiseaseResponse>> {
    return this.findAllBase(
      paginationDto,
      formatDiseaseResponse,
      (queryBuilder) => {
        queryBuilder
          .where('isActive = true')
          .orderBy('disease.created_at', 'ASC');
      }
    );
  }

  async search(term: string, paginationDto: PaginationDto): Promise<Paginated<DiseaseResponse>> {
    return this.searchBase(
      term,
      paginationDto,
      formatDiseaseResponse,
      (queryBuilder, searchTerm) => {
        queryBuilder
          .where('isActive = true')
          .andWhere('disease.description LIKE :searchTerm', {searchTerm: `%${searchTerm}%`})
          .orderBy('disease.created_at', 'ASC');
      }
    )
  }
}
