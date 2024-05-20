import { Schema, model } from 'mongoose';

export interface WineDocument {
	_id?: string;
	name: string;
	description?: string;
	kind?: string;
	quality?: string;
	color?: string;
	variety?: string;
	volume?: number;
	year?: number;
	price: number;
	categories?: string[];
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
		quality: {
			type: String,
			trim: true,
		},
		color: {
			type: String,
			trim: true,
		},
		variety: {
			type: String,
			trim: true,
		},
		price: {
			type: Number,
		},
		volume: {
			type: Number,
		},
		year: {
			type: Number,
		},
		categories: [
			{
				type: String,
				trim: true,
			},
		],
		published: {
			type: Boolean,
			default: false,
		},
	})
);

export interface WineModel extends WineDocument {}
