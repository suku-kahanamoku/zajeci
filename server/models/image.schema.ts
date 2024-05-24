import { Schema, model } from 'mongoose';
import { WineSchema } from './wine.schema';

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

const imageSchema = new Schema(
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
);

const removeFromWine = async function (doc: any, next: Function) {
	const imageId = doc._id;

	await WineSchema.updateMany(
		{
			$or: [{ 'image.main': imageId }, { 'image.variants': imageId }],
		},
		[
			// Odstranit imageId z pole variants
			{
				$set: {
					'image.variants': {
						$filter: {
							input: '$image.variants',
							as: 'variantId',
							cond: { $ne: ['$$variantId', imageId] },
						},
					},
				},
			},
			// Odstranit z main
			{
				$unset: { 'image.main': { $cond: [{ $eq: ['$image.main', imageId] }, 1, 0] } },
			},
		]
	);

	next();
};

imageSchema.post('deleteOne', removeFromWine);

imageSchema.post('findOneAndDelete', removeFromWine);

imageSchema.post('deleteMany', async function (docs: any[], next: Function) {
	const deletedImageIds = docs.map((doc) => doc._id);

	await WineSchema.updateMany(
		{
			$or: [{ 'image.main': { $in: deletedImageIds } }, { 'image.variants': { $in: deletedImageIds } }],
		},
		[
			// Odstranit ID smazanych obrazku z pole variants
			{
				$set: {
					'image.variants': {
						$filter: {
							input: '$image.variants',
							as: 'variantId',
							cond: { $not: { $in: ['$$variantId', deletedImageIds] } },
						},
					},
				},
			},
			// Odstranit z main
			{
				$unset: { 'image.main': { $in: deletedImageIds } },
			},
		]
	);

	next();
});

export const ImageSchema = model<ImageDocument>('images', imageSchema);

export interface ImageModel extends ImageDocument {}