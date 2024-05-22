<script setup lang="ts">
	import { useToNumber } from '@vueuse/core';
	import type { CartModel } from '@/server/models/order.schema';

	const { locale } = useI18n();
	const localePath = useLocalePath();
	const { routes } = useMenuItems();
	const store = useCashdeskStore();
	const isOpen = ref(false);
	const deleted = ref();

	const increaseQuantity = (cart: CartModel) => {
		store.addItem(cart.wine, 1);
	};

	const decreaseQuantity = (cart: CartModel) => {
		if (cart.quantity > 1) {
			store.removeItem(cart.wine?._id);
		} else {
			removeItem(cart);
		}
	};

	const removeItem = (cart: CartModel) => {
		deleted.value = cart;
		isOpen.value = true;
	};

	const setQuantity = (value: number, cart: CartModel) => {
		if (value > 0) {
			store.setQuantity(cart.wine?._id, value);
		} else {
			removeItem(cart);
		}
	};
</script>

<template>
	<div v-if="store.carts.length">
		<div
			v-for="cart in store.carts"
			:key="cart.wine._id"
			class="flex flex-col md:flex-row items-center justify-between px-4 py-2 rounded-lg shadow space-x-0 md:space-x-4 space-y-4 md:space-y-0 dark:border dark:border-gray-700"
		>
			<NuxtLink
				:to="localePath(`${routes.wine.path}/${cart.wine._id}`)"
				class="flex flex-col md:flex-row items-center"
			>
				<NuxtImg
					:src="cart.wine.image?.main?.src || '/img/bottle.jpg'"
					:alt="'wine'"
					loading="lazy"
					format="webp"
					height="100"
					class="object-cover rounded-lg"
				/>
				<h3 class="text-lg font-semibold">{{ cart.wine.name }}</h3>
			</NuxtLink>
			<div class="flex items-center justify-between space-x-4 sm:space-x-12">
				<div class="flex items-center justify-between space-x-2">
					<UButton
						icon="i-heroicons-minus"
						color="orange"
						:ui="{ rounded: 'rounded-full' }"
						@click="decreaseQuantity(cart)"
					/>
					<UInput
						:model-value="cart.quantity"
						type="number"
						:ui="{ base: 'appearance-none w-14 text-center' }"
						:min="1"
						@change="setQuantity(parseInt($event), cart)"
					/>
					<UButton
						icon="i-heroicons-plus"
						color="green"
						:ui="{ rounded: 'rounded-full' }"
						@click="increaseQuantity(cart)"
					/>
				</div>
				<div class="flex justify-between space-x-4 sm:space-x-12">
					<p class="text-lg font-semibold min-w-24 text-end">
						{{ useToNumber(cart?.total_price?.toFixed(2) || 0).value.toLocaleString(locale) }}&nbsp;{{
							$t('$.czk')
						}}
					</p>
					<UButton icon="i-heroicons-trash" color="red" @click="removeItem(cart)" />
				</div>
			</div>
		</div>
	</div>
	<div v-else class="text-center text-gray-500">{{ $t('$.cashdesk.cart.empty') }}</div>

	<UiModalConfirm v-model="isOpen" @confirm="$event && store.deleteItem(deleted?.wine?._id)">
		{{ $t('$.cashdesk.cart.remove', { name: deleted?.wine?.name }) }}
	</UiModalConfirm>
</template>
