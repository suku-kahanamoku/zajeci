import { Schema, model } from 'mongoose';
import { AddressSchema } from './address.schema';
import {
	CartDocument,
	DeliveryDocument,
	DeliveryServices,
	PaymentDocument,
	PaymentServices,
} from '../types/order.type';
import { OrderDocument, OrderStatus } from '../types/user.type';

/**
 * Mongo schema pro dopravu v cashdesku
 */
const DeliverySchema = new Schema<DeliveryDocument>({
	type: {
		type: String,
		enum: Object.values(DeliveryServices),
		default: DeliveryServices.free,
		required: true,
	},
	address: {
		type: AddressSchema,
		required: true,
	},
	total_price: {
		type: Number,
		required: true,
		default: 0,
	},
});

/**
 * Mongo schema pro payment v cashdesku
 */
const PaymentSchema = new Schema<PaymentDocument>({
	type: {
		type: String,
		enum: Object.values(PaymentServices),
		default: PaymentServices.card,
		required: true,
	},
	total_price: {
		type: Number,
		required: true,
		default: 0,
	},
});

/**
 * Mongo schema pro jednotlive kosiky v cashdesku
 */
const CartSchema = new Schema<CartDocument>({
	quantity: {
		type: Number,
		required: true,
		min: 1,
	},
	unit_price: {
		type: Number,
		required: true,
		default: 0,
	},
	total_price: {
		type: Number,
		required: true,
		default: 0,
	},
});

/**
 * Mongo schema pro cashdesk
 */
export const OrderSchema = model<OrderDocument>(
	'orders',
	new Schema<OrderDocument>(
		{
			carts: [CartSchema],
			total_quantity: {
				type: Number,
				required: true,
				default: 0,
			},
			total_price: {
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
	)
);
