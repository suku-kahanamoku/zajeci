import { Schema, model } from 'mongoose';
import { UserSchema } from './user.schema';
import { AddressDocument } from '../types/address.type';

export const AddressSchema = new Schema(
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
		postal_code: {
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
		timestamps: true, // Automatically adds created_at and updated_at fields
	}
);

const removeFromUser = async function (doc: any, next: Function) {
	const addressId = doc._id;

	// Aktualizovat uzivatele, kteri maji tuto adresu jako hlavni nebo variantu
	await UserSchema.updateMany(
		{
			$or: [{ 'address.main': addressId }, { 'address.variants': addressId }],
		},
		[
			// Odstranit addressId z pole variants
			{
				$set: {
					'address.variants': {
						$filter: {
							input: '$address.variants',
							as: 'variantId',
							cond: { $ne: ['$$variantId', addressId] },
						},
					},
				},
			},
			// Odstranit hlavni adresu, pokud odpovida addressId
			{
				$unset: { 'address.main': { $cond: [{ $eq: ['$address.main', addressId] }, 1, 0] } },
			},
		]
	);

	next();
};

AddressSchema.post('deleteOne', removeFromUser);

AddressSchema.post('findOneAndDelete', removeFromUser);

AddressSchema.post('deleteMany', async function (docs: any[], next: Function) {
	// Seznam ID adres ke smazani
	const deletedAddressIds = docs.map((doc) => doc._id);

	// Aktualizovat uzivatele, kteri maji smazane adresy
	await UserSchema.updateMany(
		{
			$or: [{ 'address.main': { $in: deletedAddressIds } }, { 'address.variants': { $in: deletedAddressIds } }],
		},
		[
			// Odstranit ID smazanych adres z pole variants
			{
				$set: {
					'address.variants': {
						$filter: {
							input: '$address.variants',
							as: 'variantId',
							cond: { $not: { $in: ['$$variantId', deletedAddressIds] } },
						},
					},
				},
			},
			// Odstranit hlavni adresy, ktere jsou mezi smazanymi adresami
			{
				$unset: { 'address.main': { $in: deletedAddressIds } },
			},
		]
	);

	next();
});

export const AddressModel = model<AddressDocument>('addresses', AddressSchema);
