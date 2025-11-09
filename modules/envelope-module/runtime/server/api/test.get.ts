import PDFDocument from 'pdfkit';
import { defineEventHandler, setResponseHeaders } from 'h3';

export default defineEventHandler(async (event) => {
  const doc = new PDFDocument();
  const chunks: Buffer[] = [];

  // zachytí PDF data do bufferu
  doc.on('data', chunk => chunks.push(chunk));
  const pdfEnd = new Promise<Buffer>((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
  });

  // obsah PDF
  doc.fontSize(20).text('PDFKit + Nuxt 3', 100, 100);
  doc.moveDown().fontSize(12).text('Toto PDF bylo vygenerováno na serveru.');

  doc.end();

  const pdf = await pdfEnd;

  setResponseHeaders(event, {
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline; filename="document.pdf"',
  });

  return new Uint8Array(pdf);
});
