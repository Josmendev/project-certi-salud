import { TDocumentDefinitions } from 'pdfmake/interfaces';

export const getCertificateByIdReport = (
  certificateId: string,
): TDocumentDefinitions => {
  const docDefinition: TDocumentDefinitions = {
    content: ['CERTIFICADO MEDICO', certificateId],
  };
  return docDefinition;
};
