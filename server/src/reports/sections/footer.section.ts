import { Content } from 'pdfmake/interfaces';

export const footerSection = (
  currentPage: number,
  pageCount: number,
): Content => {
  return {
    text: `Página ${currentPage.toString()} de ${pageCount}`,
    alignment: 'right',
    bold: true,
    margin: [20, 20],
  };
};
