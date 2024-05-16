import { Schema, model } from 'mongoose';

export interface UserDocument {
	_id: string;
	email: string;
	name?: string;
	family_name?: string;
	given_name?: string;
	password?: string;
	temp_password?: string;
	terms?: boolean;
	newsletter?: boolean;
}

export const UserSchema = model<UserDocument>(
	'user',
	new Schema({
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
	})
);

export interface UserModel extends UserDocument {
	picture?: string;
	sub?: string;
	new_password?: string;
}
