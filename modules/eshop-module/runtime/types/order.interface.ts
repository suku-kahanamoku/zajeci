import type { IAddress, IUser } from "@suku-kahanamoku/auth-module/types";
import type { IItem, IResponse } from "@suku-kahanamoku/common-module/types";
import type { IWine } from "@/modules/wine-module/runtime/types/wine.interface";

/**
 * Enum pro typy plateb
 *
 * @export
 * @enum {number}
 */
export enum PaymentServices {
  bank = "bank",
  card = "card",
  paypal = "paypal",
  gopay = "gopay",
  applePay = "applePay",
  googlePay = "googlePay",
  cash = "cash",
}

/**
 * Rozhrani pro payment v cashdesku
 *
 * @export
 * @interface IPayment
 */
export interface IPayment {
  type: PaymentServices | string;
  label: string;
  unit_price: number;
  total_price?: number;
  avatar?: string;
  disabled?: boolean;
  valid?: boolean;
  value?: PaymentServices | string;
}

/**
 * Enum pro typy doprav
 *
 * @export
 * @enum {number}
 */
export enum ShippingServices {
  free = "free",
  ppl = "ppl",
  gls = "gls",
  dpd = "dpd",
  post = "post",
  zas = "zas",
  dhl = "dhl",
  geis = "geis",
}

/**
 * Rozhrani pro shipping v cashdesku
 *
 * @export
 * @interface IShipping
 */
export interface IShipping {
  type: ShippingServices | string;
  label: string;
  unit_price: number;
  total_price?: number;
  disabled?: boolean;
  avatar?: string;
  help?: string;
  address?: IAddress;
  valid?: boolean;
  key?: number;
  value: ShippingServices | string;
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
  product_id: number;
  quantity: number;
  unit_price: string;
  total_price: string;
  description?: string;
}

/** PHP backend order response */
export interface IOrder extends IItem {
  order_number: string;
  user_id: number;
  status: OrderStatus | string;
  total_amount: string;
  currency: string;
  payment_method: string;
  shipping_address_id?: number | null;
  billing_address_id?: number | null;
  note?: string;
  order_items?: IOrderItem[];
}

export interface IOrderResponse extends IResponse {
  data?: IOrder;
}

export interface IOrdersResponse extends IResponse {
  data?: IOrder[];
}
