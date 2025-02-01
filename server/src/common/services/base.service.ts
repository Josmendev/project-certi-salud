import { Injectable } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PaginationDto } from "../dto/pagination.dto";
import { Paginated } from "../interfaces/paginated.interface";
import { paginate } from "../helpers/paginate.helper";

@Injectable()
export abstract class BaseService<T> {
  constructor(private readonly repository: Repository<T>){}

  async findAll(
    paginationDto: PaginationDto,
    formatResponse: (entity: T) => any,
    buildQueryBuilder?: (queryBuilder: SelectQueryBuilder<T>) => void
  ): Promise<Paginated<any>> {
    const queryBuilder = this.repository.createQueryBuilder();
    if(buildQueryBuilder) buildQueryBuilder(queryBuilder);
    const result = await paginate(queryBuilder, paginationDto);
    return {
      ...result,
      data: result.data.map(formatResponse)
    }
  }

  async search(
    term: string,
    paginationDto: PaginationDto,
    formatResponse: (entity: T) => any,
    buildQueryBuilder?: (queryBuilder: SelectQueryBuilder<T>, searchTerm: string) => void
  ): Promise<Paginated<any>> {
    const queryBuilder = this.repository.createQueryBuilder();
    buildQueryBuilder(queryBuilder, term);
    const result = await paginate(queryBuilder, paginationDto);
    return {
      ...result,
      data: result.data.map(formatResponse)
    }
  }
}