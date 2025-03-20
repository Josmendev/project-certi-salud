import { ListDiseaseResponseService } from "../services/ListDiseasesService";
import { SearchDiseasesService } from "../services/SearchDiseasesService";

// Funcion para obtener y buscar diseases
export const getDiseases = async ({
  limit,
  page,
  query = "",
}: {
  limit?: number;
  page: number;
  query?: string;
}) => {
  return query
    ? SearchDiseasesService({ limit, page, query })
    : ListDiseaseResponseService({ limit, page });
};
