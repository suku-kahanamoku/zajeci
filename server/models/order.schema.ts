import { Schema, model } from 'mongoose';
import {
	CartDocument,
	DeliveryDocument,
	DeliveryServices,
	OrderDocument,
	OrderStatus,
	PaymentDocument,
	PaymentServices,
} from '../types/order.type';
import { UserDocument } from '../types/user.type';
import { AddressDocument } from '../types/address.type';

export const AddressOrderSchema = new Schema<AddressDocument>(
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

const UserOrderSchema = new Schema<UserDocument>(
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
const DeliverySchema = new Schema<DeliveryDocument>(
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
const PaymentSchema = new Schema<PaymentDocument>(
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
const CartSchema = new Schema<CartDocument>(
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

CartSchema.pre('save', function (next) {
	delete this.wine?.image?.variants;
	next();
});

const OrderSchema = new Schema<OrderDocument>(
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
export const OrderModel = model<OrderDocument>('orders', OrderSchema);
