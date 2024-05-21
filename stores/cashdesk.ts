import { type WineModel } from '@/server/models/wine.schema';
import type { CartModel } from '@/server/models/order.schema';

export const useCashdeskStore = defineStore('Cashdesk', () => {
	const authStore = useAuthStore();

	const carts = ref<CartModel[]>([]);

	const totalItems = computed(() => {
		return carts.value.reduce((total, item) => total + item.quantity, 0);
	});

	const total_price = computed(() => {
		return carts.value.reduce((total, item) => total + item.unit_price * item.quantity, 0);
	});

	const addItem = (wine: WineModel, quantity: number): CartModel => {
		let result;
		const existingItem = carts.value.find((item) => item.wine._id === wine._id);
		if (existingItem) {
			existingItem.quantity += quantity;
			existingItem.total_price = existingItem.unit_price * existingItem.quantity;
			result = existingItem;
		} else {
			const newItem: CartModel = {
				wine,
				quantity,
				unit_price: wine.price,
				total_price: wine.price * quantity,
			};
			carts.value.push(newItem);
			result = newItem;
		}
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
		}
	};

	const deleteItem = (wineId: string) => {
		carts.value = carts.value.filter((item) => item.wine._id !== wineId);
	};

	const clearCart = () => {
		carts.value = [];
	};

	return {
		carts,
		addItem,
		removeItem,
		deleteItem,
		clearCart,
		totalItems,
		total_price,
	};
});
