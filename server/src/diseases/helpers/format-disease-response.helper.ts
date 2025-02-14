import { Disease } from '../entities/disease.entity';

export const formatDiseaseResponse = (disease: Disease) => {
  const { createdAt, updatedAt, ...diseaseData } = disease;
  return diseaseData;
};
