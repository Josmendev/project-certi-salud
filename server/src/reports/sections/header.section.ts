import { Content } from 'pdfmake/interfaces';
import { DateFormater } from '../helpers/date-formater.helper';

interface HeaderOptions {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  showDate?: boolean;
}

export const headerSection = (options: HeaderOptions): Content => {
  const { imageUrl, title, subtitle, showDate = true } = options;
  const headerLogo: Content = imageUrl
    ? {
        image: imageUrl,
        width: 140,
        height: 80,
        alignment: 'left',
        margin: [30, 5],
      }
    : null;

  const headerDate: Content = showDate
    ? {
        text: DateFormater.getDDMMMMYYYY(new Date()).toUpperCase(),
        alignment: 'right',
        margin: [20, 30],
      }
    : null;

  const headerSubtitle: Content = subtitle
    ? {
        text: subtitle,
        bold: true,
        fontSize: 14,
        marginTop: 2,
        alignment: 'center',
      }
    : null;

  const headerTitle: Content = title
    ? {
        text: title,
        bold: true,
        fontSize: 20,
        marginTop: 15,
        alignment: 'center',
      }
    : null;

  return {
    table: {
      widths: ['auto', '*', 'auto'],
      body: [
        [headerLogo, { stack: [headerTitle, headerSubtitle] }, headerDate],
      ],
    },
    layout: 'noBorders',
  };
};
