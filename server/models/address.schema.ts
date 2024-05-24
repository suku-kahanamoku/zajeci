import { Schema, model } from 'mongoose';
import { UserSchema } from './user.schema';

export interface AddressDocument {
	_id: string;
	street: string;
	city: string;
	state: string;
	postal_code: string;
	country?: string;
}

const addressSchema = new Schema({
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
});

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

addressSchema.post('deleteOne', removeFromUser);

addressSchema.post('findOneAndDelete', removeFromUser);

addressSchema.post('deleteMany', async function (docs: any[], next: Function) {
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

export const AddressSchema = model<AddressDocument>('addresses', addressSchema);

export interface AddressModel extends AddressDocument {}
