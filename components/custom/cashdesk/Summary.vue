<script setup lang="ts">
	import { useToNumber } from '@vueuse/core';

	const { locale } = useI18n();
	const localePath = useLocalePath();
	const { routes } = useMenuItems();
	const store = useCashdeskStore();
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
				<div class="flex items-center justify-between space-x-2">{{ cart.quantity }}</div>
				<div class="flex justify-between space-x-4 sm:space-x-12">
					<p class="text-lg font-semibold min-w-24 text-end">
						{{ useToNumber(cart?.total_price?.toFixed(2) || 0).value.toLocaleString(locale) }}&nbsp;{{
							$t('$.czk')
						}}
					</p>
				</div>
			</div>
		</div>
	</div>
	<div v-else class="text-center text-gray-500">{{ $t('$.cashdesk.cart.empty') }}</div>
</template>
