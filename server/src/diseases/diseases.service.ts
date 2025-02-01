import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Disease } from './entities/disease.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { paginate } from 'src/common/helpers/paginate.helper';
import { formatDiseaseResponse } from './helpers/format-disease-response.helper';
import { DiseaseResponse } from './interfaces/disease-response.interface';
import { Paginated } from 'src/common/interfaces/paginated.interface';

@Injectable()
export class DiseasesService {
  constructor(
    @InjectRepository(Disease)
    private readonly diseaseRepository: Repository<Disease>
  ){}

  // Methods for endpoints
  async findAll(paginationDto: PaginationDto): Promise<Paginated<DiseaseResponse>> {
    const queryBuilder = this.buildDiseaseQueryBuilder();
    const diseases = await paginate(queryBuilder, paginationDto);
    return {
      ...diseases,
      data: diseases.data.map(formatDiseaseResponse)
    }
  }

  async search(term: string, paginationDto: PaginationDto): Promise<Paginated<DiseaseResponse>> {
    const queryBuilder = this.buildDiseaseQueryBuilder({searchTerm: term});
    const diseases = await paginate(queryBuilder, paginationDto);
    return {
      ...diseases,
      data: diseases.data.map(formatDiseaseResponse)
    }
  }

  // Internal helpers methods
  private buildDiseaseQueryBuilder (filters?: {searchTerm?: string}): SelectQueryBuilder<Disease> {
    const queryBuilder = this.diseaseRepository.createQueryBuilder('disease')
      .where('isActive = true')
      .orderBy('disease.createdAt', 'ASC');
    if(filters?.searchTerm) {
      queryBuilder.andWhere(
        'disease.description LIKE :searchTerm',
        {searchTerm: `%${filters.searchTerm}%`}
      )
    }
    return queryBuilder;
  }
}
