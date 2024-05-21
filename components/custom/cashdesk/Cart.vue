<script setup lang="ts">
	import { useToNumber } from '@vueuse/core';

	const { locale } = useI18n();
	const store = useCashdeskStore();

	const increaseQuantity = (wineId: string) => {
		const item = store.carts.find((item) => item.wine._id === wineId);
		if (item) {
			store.addItem(item.wine, 1);
		}
	};

	const decreaseQuantity = (wineId: string) => {
		const item = store.carts.find((item) => item.wine._id === wineId);
		if (item) {
			store.removeItem(wineId);
		}
	};

	const removeItem = (wineId: string) => {
		store.deleteItem(wineId);
	};
</script>

<template>
	<div v-if="store.carts.length" class="space-y-4">
		<div
			v-for="cart in store.carts"
			:key="cart.wine._id"
			class="flex items-center justify-between bg-white p-4 rounded-lg shadow-md"
		>
			<div class="flex items-center space-x-4">
				<div>
					<img :src="cart.wine.image" alt="Wine Image" class="w-16 h-16 object-cover rounded-lg" />
				</div>
				<div>
					<h3 class="text-lg font-semibold">{{ cart.wine.name }}</h3>
				</div>
			</div>
			<div class="flex items-center space-x-2">
				<UButton
					icon="i-heroicons-minus"
					color="orange"
					:ui="{ rounded: 'rounded-full' }"
					@click="decreaseQuantity(cart.wine._id)"
				/>
				<input type="number" v-model.number="cart.quantity" class="w-16 text-center border rounded-lg" />
				<UButton
					icon="i-heroicons-plus"
					color="green"
					:ui="{ rounded: 'rounded-full' }"
					@click="increaseQuantity(cart.wine._id)"
				/>
				<UButton icon="i-heroicons-trash" color="red" @click="removeItem(cart.wine._id)" />
			</div>
			<div class="text-right">
				<p class="text-lg font-semibold">
					{{ useToNumber(cart?.total_price?.toFixed(2) || 0).value.toLocaleString(locale) }}&nbsp;{{
						$t('$.czk')
					}}
				</p>
			</div>
		</div>
	</div>
	<div v-else class="text-center text-gray-500">Košík je prázdný</div>
</template>
