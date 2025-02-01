import { Injectable } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PaginationDto } from "../dto/pagination.dto";
import { Paginated } from "../interfaces/paginated.interface";
import { paginate } from "../helpers/paginate.helper";

@Injectable()
export abstract class BaseService<T> {
  constructor(private readonly repository: Repository<T>){}

  async findAllBase(
    paginationDto: PaginationDto,
    alias: string,
    formatResponse: (entity: T) => any,
    buildQueryBuilder?: (queryBuilder: SelectQueryBuilder<T>) => void
  ): Promise<Paginated<any>> {
    const queryBuilder = this.repository.createQueryBuilder(alias);
    if(buildQueryBuilder) buildQueryBuilder(queryBuilder);
    const result = await paginate(queryBuilder, paginationDto);
    return {
      ...result,
      data: result.data.map(formatResponse)
    }
  }

  async searchBase(
    term: string,
    paginationDto: PaginationDto,
    alias: string,
    formatResponse: (entity: T) => any,
    buildQueryBuilder?: (queryBuilder: SelectQueryBuilder<T>, searchTerm: string) => void
  ): Promise<Paginated<any>> {
    const queryBuilder = this.repository.createQueryBuilder(alias);
    buildQueryBuilder(queryBuilder, term);
    const result = await paginate(queryBuilder, paginationDto);
    return {
      ...result,
      data: result.data.map(formatResponse)
    }
  }
}