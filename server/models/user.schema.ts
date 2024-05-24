import { Schema, model } from 'mongoose';
import { AddressSchema } from './address.schema';
import { AddressDocument } from '../types/address.type';
import { UserDocument } from '../types/user.type';

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			index: true,
			trim: true,
			lowercase: true,
		},
		name: {
			type: String,
			trim: true,
		},
		family_name: {
			type: String,
			trim: true,
		},
		given_name: {
			type: String,
			trim: true,
		},
		password: {
			type: String,
			trim: true,
		},
		temp_password: {
			type: String,
			trim: true,
		},
		terms: {
			type: Boolean,
		},
		newsletter: {
			type: Boolean,
			default: true,
		},
		role: {
			type: String,
			default: 'guest',
			trim: true,
		},
		address: {
			main: {
				type: Schema.Types.ObjectId,
				ref: 'addresses',
			},
			variants: [
				{
					type: Schema.Types.ObjectId,
					ref: 'addresses',
				},
			],
		},
	},
	{
		timestamps: true, // Automatically adds created_at and updated_at fields
	}
);

userSchema.post('find', async function (docs: any[], next: Function) {
	await fetchUsersWithAddresses(docs);
	next();
});

userSchema.pre('findOne', function () {
	this.populate('address.main').populate('address.variants');
});

export const UserSchema = model<UserDocument>('users', userSchema);

export interface UserModel extends UserDocument {
	picture?: string;
	sub?: string;
	new_password?: string;
}

async function fetchUsersWithAddresses(users: UserDocument[]) {
	if (!users || users.length === 0) return;

	// Collect all address IDs
	const addressIds = new Set();
	users.forEach((user) => {
		if (user.address?.main) {
			addressIds.add(user.address.main);
		}
		if (user.address?.variants) {
			user.address.variants.forEach((variantId) => addressIds.add(variantId));
		}
	});

	// Fetch all addresss using $in
	const addresses = await AddressSchema.find({ _id: { $in: Array.from(addressIds) } }).lean();
	const addressMap = new Map(addresses.map((address) => [address._id.toString(), address]));

	// Map addresses back to users
	users.forEach((user) => {
		if (user.address?.main) {
			user.address.main = addressMap.get(user.address.main.toString());
		}
		if (user.address?.variants) {
			user.address.variants = user.address?.variants?.map((variantId) =>
				addressMap.get(variantId.toString())
			) as AddressDocument[];
		}
	});
}
