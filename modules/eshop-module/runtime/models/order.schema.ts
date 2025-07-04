import { Schema, model } from "mongoose";

import {
  DeliveryServices,
  OrderStatus,
  PaymentServices,
  type ICart,
  type IDelivery,
  type IOrder,
  type IPayment,
} from "@/modules/eshop-module/runtime/types/order.interface";
import type { IUser } from "@/modules/auth-module/runtime/types/user.interface";
import type { IAddress } from "@/modules/auth-module/runtime/types/address.interface";

export const AddressOrderSchema = new Schema<IAddress>(
  {
    name: {
      type: String,
      trim: true,
    },
    street: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    zip: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const UserOrderSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      trim: true,
    },
    surname: {
      type: String,
      trim: true,
    },
    givenName: {
      type: String,
      trim: true,
    },
    address: {
      main: AddressOrderSchema,
    },
    phone: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

/**
 * Mongo schema pro dopravu v cashdesku
 */
const DeliverySchema = new Schema<IDelivery>(
  {
    type: {
      type: String,
      enum: Object.values(DeliveryServices),
      default: DeliveryServices.free,
      required: true,
    },
    address: {
      type: AddressOrderSchema,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

/**
 * Mongo schema pro payment v cashdesku
 */
const PaymentSchema = new Schema<IPayment>(
  {
    type: {
      type: String,
      enum: Object.values(PaymentServices),
      default: PaymentServices.card,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

/**
 * Mongo schema pro jednotlive kosiky v cashdesku
 */
const CartSchema = new Schema<ICart>(
  {
    wine: {
      type: Schema.Types.Mixed,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

CartSchema.pre("save", function (next) {
  delete this.wine?.image?.variants;
  next();
});

const OrderSchema = new Schema<IOrder>(
  {
    user: UserOrderSchema,
    carts: [CartSchema],
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.pending,
    },
    delivery: {
      type: DeliverySchema,
      required: true,
    },
    payment: {
      type: PaymentSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Mongo schema pro cashdesk
 */
export const OrderModel = model<IOrder>("orders", OrderSchema);
