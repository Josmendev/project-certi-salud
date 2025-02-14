import { SelectQueryBuilder } from 'typeorm';
import { PaginationDto } from '../dto/pagination.dto';
import { Paginated } from '../interfaces/paginated.interface';

export const paginate = async <T>(
  queryBuilder: SelectQueryBuilder<T>,
  paginationDto: PaginationDto,
): Promise<Paginated<T>> => {
  const { page = 1, limit = 5 } = paginationDto;
  const skip = (page - 1) * limit;
  const [data, total] = await queryBuilder
    .skip(skip)
    .take(limit)
    .getManyAndCount();

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
