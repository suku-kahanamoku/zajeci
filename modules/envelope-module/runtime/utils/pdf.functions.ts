import PDFDocument from "pdfkit";

const fontUrl =
  "https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.0/ttf/DejaVuSans.ttf";
const font = "dejavu";
const size = "A4";
const margin = 40;

async function getPdfDoc(): Promise<{
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

function renderIcoDic(
  doc: typeof PDFDocument,
  entity: { ico?: string; dic?: string },
  x?: number,
  y?: number,
  lineOptions?: any
) {
  if (entity.ico) doc.text(`IČO: ${entity.ico}`, x, y, lineOptions);
  if (entity.dic)
    doc.text(
      `DIČ: ${entity.dic}`,
      x,
      y === undefined ? undefined : y + 15,
      lineOptions
    );

  // Přidání čáry pod DIČ
  const currentY = doc.y;
  const lineStartX = x || margin;
  const lineEndX = lineStartX + 200;
  doc
    .strokeOpacity(0.3)
    .moveTo(lineStartX, currentY)
    .lineTo(lineEndX, currentY)
    .stroke();
}

function renderCustomer(
  doc: typeof PDFDocument,
  customer: any,
  lineOptions: any
) {
  const rightColX = 300;
  doc.text("Odběratel:", rightColX, margin, lineOptions);
  doc.text(customer.company, rightColX, undefined, lineOptions);
  doc.text(customer.address, rightColX, undefined, lineOptions);
  doc.text(
    `${customer.zip} ${customer.city}`,
    rightColX,
    undefined,
    lineOptions
  );
  doc.moveDown();
  renderIcoDic(doc, customer, rightColX, undefined, lineOptions);

  doc.moveDown();
  doc.text(
    `Číslo objednávky: ${customer.orderNumber}`,
    rightColX,
    undefined,
    lineOptions
  );
  doc.text(
    `Datum vystavení: ${customer.issueDate}`,
    rightColX,
    undefined,
    lineOptions
  );
  doc.text(
    `Datum splatnosti: ${customer.dueDate}`,
    rightColX,
    undefined,
    lineOptions
  );

  // Přidání čáry pod datum splatnosti
  const currentY = doc.y;
  doc
    .strokeOpacity(0.3)
    .moveTo(rightColX, currentY)
    .lineTo(rightColX + 200, currentY)
    .stroke();
}

function renderSupplier(
  doc: typeof PDFDocument,
  supplier: any,
  lineOptions: any
) {
  doc.text("Dodavatel:", margin, margin, lineOptions);
  doc.text(supplier.name, lineOptions);
  doc.text(supplier.address, lineOptions);
  doc.text(`${supplier.zip} ${supplier.city}`, lineOptions);
  doc.moveDown();
  renderIcoDic(doc, supplier, margin, undefined, lineOptions);

  doc.moveDown();
  doc.text(`Bankovní účet: ${supplier.bank}`, lineOptions);
  doc.text(`Variabilní symbol: ${supplier.vs}`, lineOptions);
  doc.text(`Způsob platby: ${supplier.payment}`, lineOptions);

  // Přidání čáry pod způsob platby
  const currentY = doc.y;
  doc
    .strokeOpacity(0.3)
    .moveTo(margin, currentY)
    .lineTo(margin + 200, currentY)
    .stroke();
}

function renderItems(
  doc: typeof PDFDocument,
  invoiceData: any,
  lineOptions: any
) {
  // Items table header
  const headerY = doc.y;
  const nameColX = margin;
  const priceColX = 400;
  const tableWidth = 500;

  // Draw table header
  doc.fontSize(14).text("Položka", nameColX, headerY, lineOptions);
  doc.text("Cena", priceColX, headerY, lineOptions);

  // Draw header underline
  const headerUnderlineY = doc.y;
  doc
    .moveTo(nameColX, headerUnderlineY)
    .lineTo(nameColX + tableWidth, headerUnderlineY)
    .strokeOpacity(0.7)
    .stroke();

  // Reset font size and add spacing
  doc.fontSize(12).moveDown();

  // Draw items
  invoiceData.items.forEach((item: any, idx: number) => {
    const itemY = doc.y;
    doc.text(`${item.name}`, nameColX, itemY, lineOptions);
    doc.text(`${item.price} Kč`, priceColX, itemY, lineOptions);
  });

  // Draw table bottom line
  const bottomLineY = doc.y + 5;
  doc
    .moveTo(nameColX, bottomLineY)
    .lineTo(nameColX + tableWidth, bottomLineY)
    .stroke();

  // Total
  doc.moveDown();
  doc.fontSize(14);
  const totalY = doc.y;
  doc.text("Celková cena:", nameColX, totalY, lineOptions);
  doc.text(`${invoiceData.total} Kč`, priceColX, totalY, lineOptions);
}

export async function createInvoicePdf(invoiceData: any): Promise<Buffer> {
  return new Promise(async (resolve) => {
    const { doc, buffers } = await getPdfDoc();
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    const lineOptions = { lineGap: 4 };
    renderSupplier(doc, invoiceData.supplier, lineOptions);
    renderCustomer(doc, invoiceData.customer, lineOptions);

    // Description with margin
    doc.y += 20; // margin před description
    doc.text(invoiceData.description, margin, undefined, lineOptions);
    doc.y += 20; // margin po description

    // Items table
    renderItems(doc, invoiceData, lineOptions);

    doc.end();
  });
}
