import { Schema, model } from 'mongoose';

export interface WineDocument {
	_id: string;
	name: string;
	description?: string;
	kind?: string;
	type?: string;
	price?: number;
	published?: boolean;
}

export const WineSchema = model<WineDocument>(
	'wines',
	new Schema({
		name: {
			type: String,
			required: true,
			unique: true,
			index: true,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
		},
		kind: {
			type: String,
			trim: true,
		},
		type: {
			type: String,
			trim: true,
		},
		price: {
			type: Number,
		},
		published: {
			type: Boolean,
			default: false,
		},
	})
);

export interface WineModel extends WineDocument {}
