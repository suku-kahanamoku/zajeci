import { AddressDocument } from './address.type';
import { WineDocument } from './wine.type';

/**
 * Enum pro typy plateb
 *
 * @export
 * @enum {number}
 */
export enum PaymentServices {
	free = 'free',
	bank = 'bank',
	card = 'card',
	paypal = 'paypal',
	gopay = 'gopay',
	apple_pay = 'apple_pay',
	google_pay = 'google_pay',
	bitcoin = 'bitcoin',
	cash = 'cash',
}

/**
 * Rozhrani pro platebni kartu
 *
 * @export
 * @interface CreditCardDocument
 */
export interface CreditCardDocument {
	card_number: string;
	expiration_date: string;
	cvv: string;
	cardholder_name: string;
}

/**
 * Rozhrani pro payment v cashdesku
 *
 * @export
 * @interface PaymentDocument
 */
export interface PaymentDocument {
	type: PaymentServices;
	credit_card?: CreditCardDocument;
	total_price: number;
}

/**
 * Enum pro typy doprav
 *
 * @export
 * @enum {number}
 */
export enum DeliveryServices {
	free = 'free',
	ppl = 'ppl',
	gls = 'gls',
	dpd = 'dpd',
	post = 'post',
	zas = 'zas',
	dhl = 'dhl',
	geis = 'geis',
}

/**
 * Rozhrani pro delivery v cashdesku
 *
 * @export
 * @interface DeliveryDocument
 */
export interface DeliveryDocument {
	type: DeliveryServices;
	address?: AddressDocument;
	total_price: number;
}

/**
 * Rozhrani pro jednotlive kosiky
 *
 * @export
 * @interface CartDocument
 */
export interface CartDocument {
	wine: WineDocument;
	quantity: number;
	unit_price: number;
	total_price: number;
}
