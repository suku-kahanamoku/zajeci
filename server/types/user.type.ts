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

/**
 * Enum pro stav objednavky
 *
 * @export
 * @enum {number}
 */
export enum OrderStatus {
	pending = 'pending',
	confirmed = 'confirmed',
	processing = 'processing',
	shipped = 'shipped',
	delivered = 'delivered',
	cancelled = 'cancelled',
	returned = 'returned',
	refunded = 'refunded',
	failed = 'failed',
	onHold = 'onHold',
}

/**
 * Rozhrani pro cashdesk
 *
 * @export
 * @interface OrderDocument
 */
export interface OrderDocument {
	user: UserDocument;
	carts: CartDocument[];
	totalPrice: number;
	status: OrderStatus;
	delivery: DeliveryDocument;
	payment: PaymentDocument;
	createdAt?: Date;
	updatedAt?: Date;
}
