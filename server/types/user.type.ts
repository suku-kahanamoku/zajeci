import { AddressDocument } from './address.type';
import { CartDocument, DeliveryDocument, PaymentDocument } from './order.type';

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
	role?: 'admin' | 'user' | 'guest';
	address?: {
		main?: AddressDocument;
		variants?: AddressDocument[];
	};
	phone?: string;
	created_at?: Date;
	updated_at?: Date;
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
	on_hold = 'on_hold',
}

/**
 * Rozhrani pro cashdesk
 *
 * @export
 * @interface OrderDocument
 */
export interface OrderDocument {
	user: UserDocument;
	items: CartDocument[];
	total_quantity: number;
	total_price: number;
	status: OrderStatus;
	delivery: DeliveryDocument;
	payment: PaymentDocument;
	created_at?: Date;
	updated_at?: Date;
}
