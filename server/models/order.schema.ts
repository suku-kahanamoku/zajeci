import { Schema, model, Document } from 'mongoose';
import { WineDocument } from './wine.schema'; // Adjust the path as necessary

// Interface for OrderItem
export interface CartDocument {
	wine_id: WineDocument['_id'];
	quantity: number;
	unit_price: number;
	total_price: number;
}

// Interface for Order
export interface OrderDocument extends Document {
	user_id: string;
	items: CartDocument[];
	total_quantity: number;
	total_price: number;
	status: string;
	created_at: Date;
	updated_at: Date;
}

// Schema for OrderItem
const OrderItemSchema = new Schema<CartDocument>({
	wine_id: {
		type: Schema.Types.ObjectId,
		ref: 'wines',
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
	},
	total_price: {
		type: Number,
		required: true,
	},
});

// Export Order model
export const OrderSchema = model<OrderDocument>(
	'orders',
	new Schema<OrderDocument>(
		{
			user_id: {
				type: String,
				required: true,
			},
			items: [OrderItemSchema],
			total_quantity: {
				type: Number,
				required: true,
			},
			total_price: {
				type: Number,
				required: true,
			},
			status: {
				type: String,
				required: true,
				default: 'Pending',
			},
		},
		{
			timestamps: true, // Automatically adds created_at and updated_at fields
		}
	)
);

export interface CartModel extends CartDocument {}
export interface OrderModel extends OrderDocument {}
