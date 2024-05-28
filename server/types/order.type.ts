import { AddressDocument } from './address.type';
import { WineDocument } from './wine.type';

/**
 * Enum pro typy plateb
 *
 * @export
 * @enum {number}
 */
export enum PaymentServices {
	bank = 'bank',
	card = 'card',
	paypal = 'paypal',
	gopay = 'gopay',
	apple_pay = 'apple_pay',
	google_pay = 'google_pay',
	cash = 'cash',
}

export const paymentObjects = {
	cash: { label: '$.cashdesk.payment.cash', price: 50, avatar: 'mdi:cash-100' },
	bank: {
		label: '$.cashdesk.payment.bank',
		price: 0,
		avatar: 'mdi:bank-outline',
	},
	card: { label: '$.cashdesk.payment.card', price: 0, avatar: 'mdi:credit-card-outline', disabled: true },
	paypal: { label: '$.cashdesk.payment.paypal', price: 0, avatar: 'logos:paypal', disabled: true },
	gopay: { label: '$.cashdesk.payment.gopay', price: 0, avatar: 'arcticons:gopay', disabled: true },
	apple_pay: { label: '$.cashdesk.payment.apple_pay', price: 0, avatar: 'simple-icons:applepay', disabled: true },
	google_pay: { label: '$.cashdesk.payment.google_pay', price: 0, avatar: 'simple-icons:googlepay', disabled: true },
};

/**
 * Rozhrani pro payment v cashdesku
 *
 * @export
 * @interface PaymentDocument
 */
export interface PaymentDocument {
	type: PaymentServices;
	total_price: number;
	valid?: boolean;
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

export const deliveryObjects = {
	free: {
		label: '$.cashdesk.delivery.brno',
		price: 0,
		avatar: 'mdi:home-city-outline',
		help: 'fdsa',
	},
	post: { label: '$.cashdesk.delivery.post', price: 105, avatar: '/img/delivery/post.jpg' },
	ppl: { label: '$.cashdesk.delivery.ppl', price: 120, avatar: '/img/delivery/ppl.jpg', disabled: true },
	zas: { label: '$.cashdesk.delivery.zas', price: 59, avatar: '/img/delivery/zasilkovna.jpg', disabled: true },
	gls: { label: '$.cashdesk.delivery.gls', price: 120, avatar: 'mdi:truck-outline', disabled: true },
	dpd: { label: '$.cashdesk.delivery.dpd', price: 120, avatar: 'mdi:truck-outline', disabled: true },
	geis: { label: '$.cashdesk.delivery.geis', price: 120, avatar: 'mdi:truck-outline', disabled: true },
};

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
	valid?: boolean;
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
