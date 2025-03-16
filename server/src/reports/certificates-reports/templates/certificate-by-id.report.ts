import {
  Content,
  StyleDictionary,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';
import { CertificateResponse } from 'src/certificates/interfaces/certificate-response.interface';
import { DateFormater } from 'src/reports/helpers/date-formater.helper';

type ReportValues = CertificateResponse;

const styles: StyleDictionary = {
  header: {
    fontSize: 20,
    bold: true,
    alignment: 'center',
    margin: [0, 0, 0, 20],
  },
  body: {
    alignment: 'justify',
    fontSize: 11,
    lineHeight: 1.5,
  },
  date: {
    alignment: 'right',
    bold: true,
    fontSize: 13,
  },
  diagnosisSubtitle: {
    bold: true,
    alignment: 'center',
    fontSize: 13,
  },
  diagnosisDiseases: {
    bold: true,
    fontSize: 13,
    lineHeight: 1.5,
  },
  firm: {
    alignment: 'center',
    marginTop: 20,
    fontSize: 10,
    bold: true,
  },
};

export const getCertificateByIdReport = (
  values: ReportValues,
  imageUrl?: string,
): TDocumentDefinitions => {
  const {
    issueDate,
    staffDni,
    staffName,
    patientDni,
    patientName,
    patientAge,
    restDays,
    diseases,
  } = values;
  const logo: Content = {
    image: imageUrl,
    width: 140,
    height: 80,
    alignment: 'center',
    margin: [0, 50, 0, 20],
  };
  const docDefinition: TDocumentDefinitions = {
    styles,
    content: [
      logo,
      {
        text: `CERTIFICADO MEDICO`,
        style: 'header',
      },
      {
        text: `LAREDO, ${DateFormater.getDDMMMMYYYY(issueDate).toUpperCase()}\n\n`,
        style: 'date',
      },
      {
        text: [
          { text: 'El que suscribe ', style: 'body' },
          { text: `Dr. ${staffName.toUpperCase()}`, bold: true },
          { text: ', con DNI: ', style: 'body' },
          { text: `${staffDni}`, bold: true },
          { text: ', certifica:\nQue el paciente ', style: 'body' },
          { text: `${patientName.toUpperCase()}`, bold: true },
          { text: ' de ', style: 'body' },
          { text: `${patientAge}`, bold: true },
          { text: ' años de edad, identificado con DNI: ', style: 'body' },
          { text: `${patientDni}`, bold: true },
          {
            text: ', fue atendido en el Hospital de Laredo.\n\n',
            style: 'body',
          },
        ],
      },
      {
        text: `DIAGNOSTICO:\n\n`,
        style: 'diagnosisSubtitle',
      },
      {
        text:
          diseases.length > 0
            ? diseases
                .map(
                  (d, index) =>
                    `${index + 1}. ${d.diseaseDescription.toUpperCase()} (CIE-10: ${d.diseaseCie10})`,
                )
                .join('\n') + '\n\n'
            : 'PERSONA CLÍNICAMENTE SANA (CIE-10: Z00.0)\n\n',
        style: 'diagnosisDiseases',
        alignment: diseases.length > 0 ? 'left' : 'center',
      },
      {
        text: `${restDays !== 'No Aplica' ? `Por consiguiente, se recomienda al paciente permanecer ${restDays} días de reposo a partir de la fecha.\n` : ''}Se emite el siguiente certificado para el uso del interesado y para fines que estime conveniente.\n\n`,
        style: 'body',
      },
      {
        text: `---------------------------------------\nDr. ${staffName.toUpperCase()}\nMédico cirujano\nDNI: ${staffDni}`,
        style: 'firm',
      },
    ],
  };
  return docDefinition;
};
