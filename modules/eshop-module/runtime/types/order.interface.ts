import type { IAddress } from "@/modules/user-module/runtime/types/address.interface";
import type { IUser } from "@/modules/user-module/runtime/types/user.interface";
import type { IItem, IResponse } from "@suku-kahanamoku/common-module/types";
import type { IWine } from "@/modules/wine-module/runtime/types/wine.interface";

/**
 * Rozhrani pro payment v cashdesku
 *
 * @export
 * @interface IPayment
 */
export interface IPayment {
  label: string;
  price: number;
  icon?: string;
  disabled?: boolean;
  valid?: boolean;
  value: string;
}

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
  price: string;
  total_price: string;
  description?: string;
}

/** PHP backend order response */
export interface IOrder extends IItem {
  order_number: string;
  user_id: number;
  status: OrderStatus | string;
  total_price: string;
  currency: string;
  payment_type: string;
  shipping_type?: string;
  shipping_price?: number;
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
