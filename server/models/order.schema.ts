import { Schema, model } from 'mongoose';
import { WineDocument, WineSchema } from './wine.schema'; // Adjust the path as necessary
import { UserDocument, UserSchema } from './user.schema';

export enum OrderStatus {
	Pending = 'Pending',
	Confirmed = 'Confirmed',
	Processing = 'Processing',
	Shipped = 'Shipped',
	Delivered = 'Delivered',
	Cancelled = 'Cancelled',
	Returned = 'Returned',
	Refunded = 'Refunded',
	Failed = 'Failed',
	OnHold = 'OnHold',
}

// Interface for OrderItem
export interface CartDocument {
	wine: WineDocument;
	quantity: number;
	unit_price: number;
	total_price: number;
}

// Schema for OrderItem
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

// Interface for Order
export interface OrderDocument {
	user: UserDocument;
	items: CartDocument[];
	total_quantity: number;
	total_price: number;
	status: OrderStatus;
	created_at?: Date;
	updated_at?: Date;
}

// Export Order model
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
				default: OrderStatus.Pending,
			},
		},
		{
			timestamps: true, // Automatically adds created_at and updated_at fields
		}
	)
);

export interface CartModel extends CartDocument {}
export interface OrderModel extends OrderDocument {}
