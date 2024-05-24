import { Schema, model } from 'mongoose';
import { WineSchema } from './wine.schema';
import { UserSchema } from './user.schema';
import { AddressSchema } from './address.schema';
import {
	CartDocument,
	CreditCardDocument,
	DeliveryDocument,
	DeliveryServices,
	PaymentDocument,
	PaymentServices,
} from '../types/order.type';
import { OrderDocument, OrderStatus, UserDocument } from '../types/user.type';

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
 * Mongo schema pro platebni kartu v paymentu v cashdesku
 */
const CreditCardSchema = new Schema<CreditCardDocument>({
	card_number: {
		type: String,
		required: true,
	},
	expiration_date: {
		type: String,
		required: true,
	},
	cvv: {
		type: String,
		required: true,
	},
	cardholder_name: {
		type: String,
		required: true,
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
	credit_card: {
		type: CreditCardSchema,
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
	wine: {
		type: WineSchema,
		required: true,
	},
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
			user: UserSchema,
			items: [CartSchema],
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
