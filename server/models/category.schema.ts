import { Schema, model } from 'mongoose';

export interface CategoryDocument {
	_id?: string;
	name: string;
	description?: string;
}

export const CategorySchema = model<CategoryDocument>(
	'categories',
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
	})
);

export interface CategoryModel extends CategoryDocument {}
