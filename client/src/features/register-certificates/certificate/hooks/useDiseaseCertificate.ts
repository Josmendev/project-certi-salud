import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllDiseasesInCertificate } from "./../repositories/certificateRepository";

export const useDiseaseCertificate = ({
  currentPage,
  searchQuery = "",
}: {
  currentPage: number;
  searchQuery: string;
}) => {
  const diseaseQueryKey = ["diseasesInCertificate", currentPage, searchQuery];

  const {
    data: dataOfDiseases,
    isLoading: isLoadingDiseases,
    isError: isErrorDisease,
    error: errorDisease,
    isSuccess: isSuccessDisease,
  } = useQuery({
    queryKey: diseaseQueryKey,
    queryFn: () => getAllDiseasesInCertificate({ page: currentPage, query: searchQuery }),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });

  return {
    dataOfDiseases,
    isLoadingDiseases,
    isErrorDisease,
    isSuccessDisease,
    errorDisease,
  };
};
