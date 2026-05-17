import PDFDocument from "pdfkit";

const fontUrl =
  "https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.0/ttf/DejaVuSans.ttf";
const font = "dejavu";
const size = "A4";
const margin = 40;

export async function getPdfDoc(): Promise<{
  doc: typeof PDFDocument;
  buffers: Buffer[];
}> {
  const doc = new PDFDocument({ size, margin });
  const buffers: Buffer[] = [];
  doc.on("data", buffers.push.bind(buffers));

  const fontRes = await fetch(fontUrl);
  const fontBuffer = await fontRes.arrayBuffer();
  doc.registerFont(font, Buffer.from(fontBuffer));
  doc.font(font);
  doc.fontSize(12);

  return { doc, buffers };
}

// Helper functions for PDF generation
export function renderLabelValue(
  doc: typeof PDFDocument,
  label: string,
  value: string,
  x?: number,
  y?: number,
  lineOptions?: any
) {
  doc
    .fillOpacity(0.6)
    .text(`${label}: `, x, y, { ...lineOptions, continued: true });
  doc.fillOpacity(1).text(value);
}

export function renderLabel(
  doc: typeof PDFDocument,
  label: string,
  x?: number,
  y?: number,
  lineOptions?: any
) {
  doc.fillOpacity(0.6).text(`${label}:`, x, y, lineOptions);
  doc.fillOpacity(1);
}

export function drawLine(
  doc: typeof PDFDocument,
  startX: number,
  endX: number,
  y?: number,
  opacity = 0.3
) {
  const lineY = y || doc.y;
  doc.strokeOpacity(opacity).moveTo(startX, lineY).lineTo(endX, lineY).stroke();
}
