import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { CertificateResponse } from 'src/certificates/interfaces/certificate-response.interface';
import { footerSection } from 'src/reports/sections/footer.section';
import { headerSection } from 'src/reports/sections/header.section';

interface ReportOptions {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  certificates: CertificateResponse[];
}

export const getCertificateAllReport = (
  options: ReportOptions,
): TDocumentDefinitions => {
  const { title, subtitle, imageUrl, certificates } = options;
  return {
    pageOrientation: 'landscape',
    header: headerSection({
      imageUrl,
      title: title ?? 'Certificados Médicos',
      subtitle: subtitle ?? 'Listado de certificados Médicos',
    }),
    footer: footerSection,
    pageMargins: [40, 100, 40, 60],
    content: [
      {
        layout: 'lightHorizontalLines', // optional
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          widths: ['auto', 'auto', '*', '*', 'auto', '*', 'auto', 'auto'],
          body: [
            [
              'Número',
              'Fecha',
              'Tipo',
              'Registrador',
              'DNI Paciente',
              'Nombres',
              'Edad',
              'Descanso',
            ],
            ...certificates.map((certificate) => [
              certificate.certificateCode,
              certificate.issueDate,
              certificate.certificateTypeDescription,
              certificate.staffName,
              certificate.patientDni,
              certificate.patientName,
              certificate.patientAge,
              certificate.restDays,
            ]),
            ['', '', '', '', '', '', 'Total', `${certificates.length}`],
          ],
        },
      },
      {
        text: 'Totales',
        style: {
          fontSize: 18,
          bold: true,
          margin: [0, 40, 0, 0],
        },
      },
      {
        layout: 'noBorders',
        table: {
          headerRows: 1,
          widths: ['auto', 'auto', '*', '*', 'auto', '*', 'auto', 'auto'],
          body: [
            [
              {
                text: 'Total de certificados',
                colSpan: 2,
                bold: true,
              },
              {},
              {
                text: `${certificates.length.toString()}`,
                bold: true,
              },
              {},
              {},
              {},
              {},
              {},
            ],
          ],
        },
      },
    ],
  };
};
