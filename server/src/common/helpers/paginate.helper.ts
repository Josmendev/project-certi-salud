import { SelectQueryBuilder } from "typeorm";
import { PaginationDto } from "../dto/pagination.dto";

export const paginate = async <T> (
  queryBuilder: SelectQueryBuilder<T>,
  paginationDto: PaginationDto
): Promise<T[]> => {
  const { page = 1, limit = 5 } = paginationDto;
  const skip = (page - 1) * limit;
  const data = await queryBuilder
    .skip(skip)
    .take(limit)
    .getMany();
  
  return data;
}