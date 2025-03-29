import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTypeCertificateOptions } from "../repositories/certificateRepository";

export const useTypeCertificate = () => {
  const typeCertificateQuery = ["typeCertificateInCertificate"];

  const {
    data: dataOfTypeCertificate,
    isLoading: isLoadingOfTypeCertificate,
    isError: isErrorOfTypeCertificate,
    error: errorOfTypeCertificate,
    isSuccess: isSuccessOfTypeCertificate,
  } = useQuery({
    queryKey: typeCertificateQuery,
    queryFn: () => getTypeCertificateOptions(),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });

  return {
    dataOfTypeCertificate,
    isLoadingOfTypeCertificate,
    isErrorOfTypeCertificate,
    isSuccessOfTypeCertificate,
    errorOfTypeCertificate,
  };
};
