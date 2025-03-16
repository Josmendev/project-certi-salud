import { Injectable } from '@nestjs/common';
import PdfPrinter from 'pdfmake';
import { BufferOptions, TDocumentDefinitions } from 'pdfmake/interfaces';

const fontsDescriptors = {
  Roboto: {
    normal: 'fonts/NotoSans-Regular.ttf',
    bold: 'fonts/NotoSans-Bold.ttf',
    italics: 'fonts/NotoSans-Italic.ttf',
    bolditalics: 'fonts/NotoSans-BoldItalic.ttf',
  },
};

@Injectable()
export class PrinterService {
  private printer = new PdfPrinter(fontsDescriptors);

  createPdf(
    docDefinition: TDocumentDefinitions,
    options?: BufferOptions,
  ): PDFKit.PDFDocument {
    return this.printer.createPdfKitDocument(docDefinition, options);
  }
}
