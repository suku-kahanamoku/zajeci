<script setup lang="ts">
	import { useToNumber } from '@vueuse/core';
	import type { CartDocument } from '@/server/types/order.type';

	const { t, locale } = useI18n();
	const localePath = useLocalePath();
	const { routes } = useMenuItems();
	const store = useCashdeskStore();
	const isOpen = ref(false);
	const deleted = ref();

	const increaseQuantity = (cart: CartDocument) => {
		store.addItem(cart.wine, 1);
	};

	const decreaseQuantity = (cart: CartDocument) => {
		if (cart.quantity > 1) {
			store.removeItem(cart.wine?._id);
		} else {
			removeItem(cart);
		}
	};

	const removeItem = (cart: CartDocument) => {
		deleted.value = cart;
		isOpen.value = true;
	};

	const setQuantity = (value: number, cart: CartDocument) => {
		if (value > 0) {
			store.setQuantity(cart.wine?._id, value);
		} else {
			removeItem(cart);
		}
	};

	const columns = [
		{ key: 'name', label: t('$.form.name') },
		{ key: 'quantity', label: t('$.form.quantity') },
		{ key: 'price', label: t('$.form.price') },
	];
</script>

<template>
	<UTable :columns="columns" :rows="store.carts" class="hidden sm:block">
		<template #name-data="{ row }">
			<NuxtLink :to="localePath(`${routes.wine.path}/${row.wine._id}`)" class="flex items-center">
				<NuxtImg
					:src="row.wine.image?.main?.src || '/img/bottle.jpg'"
					:alt="'wine'"
					loading="lazy"
					format="webp"
					height="100"
					class="object-cover rounded-lg"
				/>
				<h3 class="text-lg font-semibold text-pretty">{{ row.wine.name }}</h3>
			</NuxtLink>
		</template>
		<template #quantity-data="{ row }">
			<div class="flex items-center justify-between space-x-2">
				<UButton
					icon="i-heroicons-minus"
					color="orange"
					:ui="{ rounded: 'rounded-full' }"
					@click="decreaseQuantity(row)"
				/>
				<UInput
					:model-value="row.quantity"
					type="number"
					:ui="{ base: 'appearance-none w-14 text-center' }"
					:min="1"
					@change="setQuantity(parseInt($event), row)"
				/>
				<UButton
					icon="i-heroicons-plus"
					color="green"
					:ui="{ rounded: 'rounded-full' }"
					@click="increaseQuantity(row)"
				/>
			</div>
		</template>
		<template #price-data="{ row }">
			<div class="flex justify-between space-x-4">
				<p class="text-lg font-semibold text-end">
					{{ useToNumber(row?.total_price?.toFixed(2) || 0).value.toLocaleString(locale) }}&nbsp;{{
						$t('$.czk')
					}}
				</p>
				<UButton icon="i-heroicons-trash" color="red" @click="removeItem(row)" />
			</div>
		</template>
	</UTable>

	<div v-if="store.carts.length" class="sm:hidden">
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
					<p class="text-lg font-semibold min-w-20 text-end">
						{{ useToNumber(cart?.total_price?.toFixed(2) || 0).value.toLocaleString(locale) }}&nbsp;{{
							$t('$.czk')
						}}
					</p>
					<UButton icon="i-heroicons-trash" color="red" @click="removeItem(cart)" />
				</div>
			</div>
		</div>
	</div>

	<UiModalConfirm v-model="isOpen" @confirm="$event && store.deleteItem(deleted?.wine?._id)">
		{{ $t('$.cashdesk.cart.remove', { name: deleted?.wine?.name }) }}
	</UiModalConfirm>
</template>
