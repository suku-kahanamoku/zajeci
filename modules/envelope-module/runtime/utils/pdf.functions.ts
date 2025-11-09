import PDFDocument from "pdfkit";

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
}

function renderSupplier(doc: PDFDocument, supplier: any, lineOptions: any) {
  doc.text("Dodavatel:", 40, 40, lineOptions);
  doc.text(supplier.name, lineOptions);
  doc.text(supplier.address, lineOptions);
  doc.text(`${supplier.zip} ${supplier.city}`, lineOptions);
  doc.moveDown();
  renderIcoDic(doc, supplier, 40, undefined, lineOptions);
}

function renderCustomer(doc: PDFDocument, customer: any, lineOptions: any) {
  const rightColX = 300;
  doc.text("Odběratel:", rightColX, 40, lineOptions);
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
}

export async function createInvoicePdf(invoiceData: any): Promise<Buffer> {
  return new Promise(async (resolve) => {
    const doc = new PDFDocument({ size: "A4", margin: 40 });
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
    doc.moveDown();
    doc.text(`Bankovní účet: ${invoiceData.supplier.bank}`, lineOptions);
    doc.text(`Variabilní symbol: ${invoiceData.supplier.vs}`, lineOptions);
    doc.text(`Způsob platby: ${invoiceData.supplier.payment}`, lineOptions);

    renderCustomer(doc, invoiceData.customer, lineOptions);
    doc.moveDown();
    doc.text(
      `Číslo objednávky: ${invoiceData.customer.orderNumber}`,
      300,
      undefined,
      lineOptions
    );
    doc.text(
      `Datum vystavení: ${invoiceData.customer.issueDate}`,
      300,
      undefined,
      lineOptions
    );
    doc.text(
      `Datum splatnosti: ${invoiceData.customer.dueDate}`,
      300,
      undefined,
      lineOptions
    );

    // Description
    doc.moveDown();
    doc.text(invoiceData.description, { width: 500, ...lineOptions });

    // Items
    doc.moveDown();
    invoiceData.items.forEach((item: any, idx: number) => {
      doc.text(`${item.name}`, 60, undefined, lineOptions);
      doc.text(`${item.price} Kč`, 500, undefined, lineOptions);
    });

    // Total
    doc.moveDown();
    doc
      .fontSize(14)
      .text(
        `Celková cena: ${invoiceData.total} Kč`,
        400,
        undefined,
        lineOptions
      );

    doc.end();
  });
}
