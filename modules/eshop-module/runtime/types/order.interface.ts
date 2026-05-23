import type { IItem, IResponse } from "@suku-kahanamoku/common-module/types";
import type { IWine } from "@/modules/wine-module/runtime/types/wine.interface";

/**
 * Rozhrani pro shipping v cashdesku
 *
 * @export
 * @interface IShipping
 */
export interface IShipping {
  label: string;
  price: number;
  disabled?: boolean;
  icon?: string;
  help?: string;
  valid?: boolean;
  key?: number;
  value: string;
}

/**
 * Rozhrani pro jednotlive kosiky
 *
 * @export
 * @interface ICart
 */
export interface ICart {
  wine: IWine;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  total_price_with_vat?: number;
}

/**
 * Enum pro stav objednavky
 *
 * @export
 * @enum {number}
 */
export enum OrderStatus {
  pending = "pending",
  confirmed = "confirmed",
  delivered = "delivered",
  cancelled = "cancelled",
  returned = "returned",
  refunded = "refunded",
  failed = "failed",
  onHold = "onHold",
  completed = "completed",
}

/**
 * Rozhrani pro cashdesk
 *
 * @export
 * @interface IOrder
 */
export interface IOrderItem extends IItem {
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  vat_rate?: number;
  product_name?: string | null;
  sku?: string | null;
}

/** PHP backend order response */
export interface IOrder extends IItem {
  order_number: string;
  user_id: number | null;
  status: OrderStatus | string;
  total_price: number;
  currency: string;
  payment?: Record<string, any> | null;
  shipping?: Record<string, any> | null;
  shipping_address_id?: number | null;
  billing_address_id?: number | null;
  note?: string | null;
  items?: IOrderItem[];
  user?: { first_name: string; last_name: string; email: string };
}

export interface IOrderResponse extends IResponse {
  data?: IOrder;
}

export interface IOrdersResponse extends IResponse {
  data?: IOrder[];
}

export interface IInvoice extends IItem {
  invoice_number: string;
  order_number?: string | null;
  order_id?: number | null;
  status: string;
  currency: string;
  payment?: Record<string, any> | null;
  shipping?: Record<string, any> | null;
  total_price: number;
  total_price_with_vat?: number | null;
  total_price_all?: number | null;
  total_price_all_with_vat?: number | null;
  issued_at: string;
  due_at?: string | null;
  paid_at?: string | null;
  note?: string | null;
  user_id?: number | null;
  user?: {
    id?: number;
    first_name?: string;
    last_name?: string;
    email: string;
    phone?: string;
  } | null;
  billing_address?: Record<string, any> | null;
  shipping_address?: Record<string, any> | null;
  files?: { id: number; path: string }[];
}

export interface IInvoiceResponse extends IResponse {
  data?: IInvoice;
}

export interface IInvoicesResponse extends IResponse {
  data?: IInvoice[];
}
