import { Schema, model } from 'mongoose';

export interface ImageDocument {
	_id: string;
	src: string;
	width: number;
	height: number;
	type: string;
	name?: string;
	description?: string;
	created_at?: Date;
	updated_at?: Date;
}

export const ImageSchema = model<ImageDocument>(
	'images',
	new Schema(
		{
			src: {
				type: String,
				required: true,
				unique: true,
				index: true,
				trim: true,
			},
			width: {
				type: Number,
				required: true,
				default: 0,
			},
			height: {
				type: Number,
				required: true,
				default: 0,
			},
			type: {
				type: String,
				required: true,
				trim: true,
			},
			name: {
				type: String,
				trim: true,
			},
			description: {
				type: String,
				trim: true,
			},
		},
		{
			timestamps: true,
		}
	)
);

export interface ImageModel extends ImageDocument {}
