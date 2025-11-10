import PDFDocument from "pdfkit";

const size = "A4";
const padding = 40;

function renderIcoDic(
  doc: PDFDocument,
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
  const lineStartX = x || padding;
  const lineEndX = lineStartX + 200;
  doc.moveTo(lineStartX, currentY).lineTo(lineEndX, currentY).stroke();
}

function renderCustomer(doc: PDFDocument, customer: any, lineOptions: any) {
  const rightColX = 300;
  doc.text("Odběratel:", rightColX, padding, lineOptions);
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
    .moveTo(rightColX, currentY)
    .lineTo(rightColX + 200, currentY)
    .stroke();
}

function renderSupplier(doc: PDFDocument, supplier: any, lineOptions: any) {
  doc.text("Dodavatel:", padding, padding, lineOptions);
  doc.text(supplier.name, lineOptions);
  doc.text(supplier.address, lineOptions);
  doc.text(`${supplier.zip} ${supplier.city}`, lineOptions);
  doc.moveDown();
  renderIcoDic(doc, supplier, padding, undefined, lineOptions);

  doc.moveDown();
  doc.text(`Bankovní účet: ${supplier.bank}`, lineOptions);
  doc.text(`Variabilní symbol: ${supplier.vs}`, lineOptions);
  doc.text(`Způsob platby: ${supplier.payment}`, lineOptions);

  // Přidání čáry pod způsob platby
  const currentY = doc.y;
  doc
    .moveTo(padding, currentY)
    .lineTo(padding + 200, currentY)
    .stroke();
}

export async function createInvoicePdf(invoiceData: any): Promise<Buffer> {
  return new Promise(async (resolve) => {
    const doc = new PDFDocument({ size, padding });
    const buffers: Buffer[] = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });

    // Stáhni font z CDN
    const fontUrl =
      "https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.0/ttf/DejaVuSans.ttf";
    const fontRes = await fetch(fontUrl);
    const fontBuffer = await fontRes.arrayBuffer();
    doc.registerFont("dejavu", Buffer.from(fontBuffer));
    doc.font("dejavu");

    // Header - two columns
    doc.fontSize(12);
    const lineOptions = { lineGap: 4 };

    renderSupplier(doc, invoiceData.supplier, lineOptions);
    renderCustomer(doc, invoiceData.customer, lineOptions);

    // Description
    doc.moveDown();
    doc.text(invoiceData.description, padding, undefined, lineOptions);

    // Items
    doc.moveDown();
    invoiceData.items.forEach((item: any, idx: number) => {
      doc.text(`${item.name}`, padding, undefined, lineOptions);
      doc.text(`${item.price} Kč`, 400, undefined, lineOptions);
    });

    // Total
    doc.moveDown();
    doc.text(
      `Celková cena: ${invoiceData.total} Kč`,
      400,
      undefined,
      lineOptions
    );

    doc.end();
  });
}
