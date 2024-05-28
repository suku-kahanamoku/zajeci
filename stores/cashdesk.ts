import nuxtStorage from 'nuxt-storage';

import {
	DeliveryServices,
	deliveryObjects,
	paymentObjects,
	type PaymentDocument,
	type DeliveryDocument,
	PaymentServices,
	type CartDocument,
} from '@/server/types/order.type';
import type { UserDocument } from '@/server/types/user.type';
import type { WineDocument } from '@/server/types/wine.type';

export const useCashdeskStore = defineStore('Cashdesk', () => {
	const { user: authUser } = useAuthStore();

	const defUser = {
		email: '',
		phone: '',
		given_name: '',
		family_name: '',
		address: {
			main: {
				street: '',
				city: '',
				postal_code: '',
				state: '',
			},
		},
		valid: false,
	};

	const loadFromLocalStorage = (key: string, defaultValue: any) => {
		const local = nuxtStorage.localStorage.getData('cashdesk');
		return local ? local[key] || defaultValue : defaultValue;
	};

	const user = ref<UserDocument | null>(loadFromLocalStorage('user', authUser ? CLONE(authUser) : defUser));
	if (user.value?.address) {
		user.value.address.variants = [];
	}

	const carts = ref<CartDocument[]>(loadFromLocalStorage('carts', []));

	const delivery = ref<DeliveryDocument>(
		loadFromLocalStorage('delivery', {
			type: DeliveryServices.free,
			address: user.value?.address?.main,
			total_price: 0,
		})
	);

	const deliveries: Record<
		string,
		{ value: string; label: string; price?: number; avatar?: string; disabled?: boolean; help?: string }
	> = {};
	ITERATE(deliveryObjects, (item, name) => (deliveries[name] = { ...item, ...{ value: name } }));

	const deliveryOptions = Object.values(deliveries);

	const payment = ref<PaymentDocument>(
		loadFromLocalStorage('payment', {
			type: PaymentServices.bank,
			total_price: 0,
		})
	);

	const payments: Record<
		string,
		{ value: string; label: string; price?: number; avatar?: string; disabled?: boolean }
	> = {};
	ITERATE(paymentObjects, (item, name) => (payments[name] = { ...item, ...{ value: name } }));

	const paymentOptions = Object.values(payments);

	const fields: Record<
		string,
		{
			key: string;
			label: string;
			placeholder?: string;
			autocomplete?: string;
		}
	> = {
		total_quantity: {
			key: 'total_quantity',
			label: '$.cashdesk.total_quantity',
		},
		total_price: {
			key: 'total_price',
			label: '$.cashdesk.total_price',
		},
		status: {
			key: 'status',
			label: '$.cashdesk.status',
		},
		delivery: {
			key: 'delivery',
			label: '$.cashdesk.delivery.title',
		},
		payment: {
			key: 'payment',
			label: '$.cashdesk.payment.title',
		},
	};

	const totalItems = computed(() => {
		return carts.value.reduce((total, item) => total + item.quantity, 0);
	});

	const total_price = computed(
		() =>
			carts.value.reduce((total, item) => total + item.unit_price * item.quantity, 0) +
			delivery.value.total_price +
			payment.value.total_price
	);

	const addItem = (wine: WineDocument, quantity: number): CartDocument => {
		let result;
		const existingItem = carts.value.find((item) => item.wine._id === wine._id);
		if (existingItem) {
			existingItem.quantity += quantity;
			existingItem.total_price = existingItem.unit_price * existingItem.quantity;
			result = existingItem;
		} else {
			const newItem: CartDocument = {
				wine,
				quantity,
				unit_price: wine.price,
				total_price: wine.price * quantity,
			};
			carts.value.push(newItem);
			result = newItem;
		}
		updateLocalStorage();
		return result;
	};

	const removeItem = (wineId: string) => {
		const itemIndex = carts.value.findIndex((item) => item.wine._id === wineId);
		if (itemIndex !== -1) {
			const item = carts.value[itemIndex];
			item.quantity -= 1;
			item.total_price = item.unit_price * item.quantity;
			if (item.quantity <= 0) {
				carts.value.splice(itemIndex, 1);
			}
			updateLocalStorage();
		}
	};

	const setQuantity = (wineId: string, quantity: number) => {
		const existingItem = carts.value.find((item) => item.wine._id === wineId);
		if (existingItem) {
			existingItem.quantity = quantity;
			existingItem.total_price = existingItem.unit_price * existingItem.quantity;
			updateLocalStorage();
		}
	};

	const deleteItem = (wineId: string) => {
		carts.value = carts.value.filter((item) => item.wine._id !== wineId);
		updateLocalStorage();
	};

	const clearCart = () => {
		carts.value = [];
		updateLocalStorage();
	};

	const updateLocalStorage = () => {
		const cashdesk = {
			user: user.value,
			carts: carts.value,
			delivery: delivery.value,
			payment: payment.value,
		};
		nuxtStorage.localStorage.setData('cashdesk', JSON.stringify(cashdesk));
	};

	watch(user, updateLocalStorage, { deep: true });
	watch(carts, updateLocalStorage, { deep: true });
	watch(delivery, updateLocalStorage, { deep: true });
	watch(payment, updateLocalStorage, { deep: true });

	return {
		user,
		carts,
		addItem,
		removeItem,
		setQuantity,
		deleteItem,
		clearCart,
		totalItems,
		total_price,
		fields,
		delivery,
		deliveries,
		deliveryOptions,
		payment,
		payments,
		paymentOptions,
	};
});
