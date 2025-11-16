import PDFDocument from "pdfkit";
import type { H3Event } from "h3";
import { useTranslation } from "@intlify/h3";

import type { IUser } from "@suku-kahanamoku/auth-module/types";
import type { ICart, IOrder } from "@/modules/eshop-module/runtime/types";

import {
  renderLabelValue,
  renderLabel,
  drawLine,
  getPdfDoc,
} from "../../utils/pdf.functions";

export async function useInvoice(event: H3Event) {
  const margin = 40;

  const tt = await useTranslation(event);

  // Initialize PDF document
  const { doc, buffers } = await getPdfDoc();

  function renderIcoDic(
    entity: { ico?: string; dic?: string },
    x?: number,
    y?: number,
    lineOptions?: any
  ) {
    renderLabelValue(
      doc,
      tt("$.invoice.ico"),
      entity.ico || "---",
      x,
      y,
      lineOptions
    );

    if (entity.ico) {
      const dicY = y === undefined ? undefined : y + 15;
      if (entity.dic) {
        renderLabelValue(
          doc,
          tt("$.invoice.dic"),
          entity.dic,
          x,
          dicY,
          lineOptions
        );
      } else {
        // Zobrazit "Neplátce DPH" pokud není DIČ
        doc
          .fillOpacity(1)
          .text(tt("$.invoice.vat_exempt"), x, dicY, lineOptions);
      }
    }

    // Přidání čáry pod DIČ/VAT exempt
    const lineStartX = x || margin;
    drawLine(doc, lineStartX, lineStartX + 200);
  }

  function renderBankingInfo(
    supplier: { bank?: string; vs?: string; payment?: string },
    x?: number,
    y?: number,
    lineOptions?: any
  ) {
    if (supplier.bank) {
      renderLabelValue(
        doc,
        tt("$.invoice.bank_account"),
        supplier.bank,
        x,
        y,
        lineOptions
      );
    }
    if (supplier.vs) {
      const vsY = y === undefined ? undefined : y + 15;
      renderLabelValue(
        doc,
        tt("$.invoice.variable_symbol"),
        supplier.vs,
        x,
        vsY,
        lineOptions
      );
    }
    if (supplier.payment) {
      const paymentY = y === undefined ? undefined : y + 30;
      renderLabelValue(
        doc,
        tt("$.invoice.payment_method"),
        supplier.payment,
        x,
        paymentY,
        lineOptions
      );
    }

    // Přidání čáry pod platební informace
    const lineStartX = x || margin;
    drawLine(doc, lineStartX, lineStartX + 200);
  }

  function renderInvoiceInfo(
    customer: { orderNumber?: string; issueDate?: string; dueDate?: string },
    x?: number,
    y?: number,
    lineOptions?: any
  ) {
    if (customer.orderNumber) {
      renderLabelValue(
        doc,
        tt("$.invoice.order_number"),
        customer.orderNumber,
        x,
        y,
        lineOptions
      );
    }
    if (customer.issueDate) {
      const issueDateY = y === undefined ? undefined : y + 15;
      renderLabelValue(
        doc,
        tt("$.invoice.issue_date"),
        customer.issueDate,
        x,
        issueDateY,
        lineOptions
      );
    }
    if (customer.dueDate) {
      const dueDateY = y === undefined ? undefined : y + 30;
      renderLabelValue(
        doc,
        tt("$.invoice.due_date"),
        customer.dueDate,
        x,
        dueDateY,
        lineOptions
      );
    }

    // Přidání čáry pod údaje faktury
    const lineStartX = x || margin;
    drawLine(doc, lineStartX, lineStartX + 200);
  }

  function renderInvoiceHeader(invoiceNumber: string, lineOptions: any) {
    // Velký nadpis "Faktura 2025-0020" na střed
    doc
      .fontSize(18)
      .fillOpacity(1)
      .text(`${tt("$.invoice.title")} ${invoiceNumber}`, 0, margin, {
        ...lineOptions,
        align: "center",
        width: 515 + margin, // celá šířka stránky
      });

    doc.fontSize(12); // reset font size
  }

  function renderCustomer(customer: IUser, lineOptions: any) {
    const rightColX = 300;
    renderLabel(doc, tt("$.invoice.customer"), rightColX, 100, lineOptions);

    doc.moveDown();
    const fullName = `${customer.givenName || customer.name || ""} ${
      customer.surname || ""
    }`.trim();
    doc.text(fullName, rightColX, undefined, lineOptions);

    if (customer.address?.main) {
      doc.text(customer.address.main.street, rightColX, undefined, lineOptions);
      doc.text(
        `${customer.address.main.zip} ${customer.address.main.city}`,
        rightColX,
        undefined,
        lineOptions
      );
    }

    doc.moveDown();
    renderIcoDic(customer as any, rightColX, undefined, lineOptions);

    doc.moveDown();
    renderInvoiceInfo(customer as any, rightColX, undefined, lineOptions);
  }

  function renderSupplier(supplier: IUser, lineOptions: any) {
    renderLabel(doc, tt("$.invoice.supplier"), margin, 100, lineOptions);

    doc.moveDown();
    const fullName = `${supplier.givenName || supplier.name || ""} ${
      supplier.surname || ""
    }`.trim();
    doc.text(fullName, lineOptions);

    if (supplier.address?.main) {
      doc.text(supplier.address.main.street, lineOptions);
      doc.text(
        `${supplier.address.main.zip} ${supplier.address.main.city}`,
        lineOptions
      );
    }

    doc.moveDown();
    renderIcoDic(supplier as any, margin, undefined, lineOptions);

    doc.moveDown();
    renderBankingInfo(supplier as any, margin, undefined, lineOptions);
  }

  function renderItems(items: ICart[], totalPrice: number, lineOptions: any) {
    // Items table header
    const headerY = doc.y;
    const nameColX = margin;
    const priceColX = 400;
    const tableWidth = 515;

    // Draw table header
    doc.fontSize(12).fillOpacity(0.6);
    doc.text(tt("$.invoice.item"), nameColX, headerY, lineOptions);
    doc.text(tt("$.invoice.price"), priceColX, headerY, {
      ...lineOptions,
      align: "right",
    });
    doc.fillOpacity(1);

    // Draw header underline
    drawLine(doc, nameColX, nameColX + tableWidth, doc.y);

    // Reset font size and add spacing
    doc.fontSize(12).moveDown();

    // Draw items
    items.forEach((item: any) => {
      const itemY = doc.y;
      const itemName = `${item.wine.name} (${item.quantity}x)`;
      doc.text(itemName, nameColX, itemY, lineOptions);
      doc.text(
        `${item.totalPrice} ${tt("$.invoice.currency")}`,
        priceColX,
        itemY,
        {
          ...lineOptions,
          align: "right",
        }
      );
    });

    // Draw table bottom line
    drawLine(doc, nameColX, nameColX + tableWidth, doc.y + 5);

    // Total
    doc.moveDown();
    doc.fontSize(12);
    const totalY = doc.y;
    renderLabel(doc, tt("$.invoice.total"), nameColX, totalY, lineOptions);
    doc.text(`${totalPrice} ${tt("$.invoice.currency")}`, priceColX, totalY, {
      ...lineOptions,
      align: "right",
    });
  }

  async function createInvoicePdf(invoiceData: IOrder): Promise<Buffer> {
    return new Promise(async (resolve) => {
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      const lineOptions = { lineGap: 4 };

      // Render invoice header first
      renderInvoiceHeader(
        invoiceData.invoiceNumber || "2025-0020",
        lineOptions
      );

      renderSupplier(invoiceData.user, lineOptions);
      renderCustomer(invoiceData.user, lineOptions);

      // Přidání extra řádku pod supplier a customer sekce
      doc.moveDown();

      if (invoiceData.description) {
        doc.y += 20; // margin před description
        doc.text(invoiceData.description, margin, undefined, lineOptions);
        doc.y += 20; // margin po description
      }

      // Items table
      renderItems(invoiceData.carts, invoiceData.totalPrice, lineOptions);

      doc.end();
    });
  }

  return {
    createInvoicePdf,
    renderInvoiceHeader,
    renderIcoDic,
    renderBankingInfo,
    renderInvoiceInfo,
    renderCustomer,
    renderSupplier,
    renderItems,
  };
}
