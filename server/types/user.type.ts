import { AddressDocument } from './address.type';
import { CartDocument, DeliveryDocument, PaymentDocument } from './order.type';

export interface UserDocument {
	_id: string;
	email: string;
	name?: string;
	surname?: string;
	givenName?: string;
	password?: string;
	tempPassword?: string;
	terms?: boolean;
	newsletter?: boolean;
	role?: 'admin' | 'user' | 'guest';
	address?: {
		main?: AddressDocument;
		variants?: AddressDocument[];
	};
	phone?: string;
	createdAt?: Date;
	updatedAt?: Date;
	valid?: boolean;
}
