<script setup lang="ts">
	import { useToNumber } from '@vueuse/core';

	const { t, locale } = useI18n();
	const localePath = useLocalePath();
	const { routes } = useMenuItems();
	const store = useCashdeskStore();

	const columns = [
		{ key: 'name', label: t('$.admin.wine.form.name') },
		{ key: 'quantity', label: t('$.form.quantity') },
		{ key: 'price', label: t('$.form.price') },
	];
</script>
<template>
	<UTable :columns="columns" :rows="store.carts" class="hidden sm:block">
		<template #quantity-header="{ column }">
			<div class="text-center">
				{{ column.label }}
			</div>
		</template>
		<template #price-header="{ column }">
			<div class="text-right">
				{{ column.label }}
			</div>
		</template>

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
			<div class="w-full text-center text-lg font-semibold">{{ row.quantity }}</div>
		</template>
		<template #price-data="{ row }">
			<p class="text-lg font-semibold min-w-24 text-end">
				{{ useToNumber(row?.total_price?.toFixed(2) || 0).value.toLocaleString(locale) }}&nbsp;{{ $t('$.czk') }}
			</p>
		</template>
	</UTable>

	<div class="sm:hidden">
		<div
			v-for="cart in store.carts"
			:key="cart.wine._id"
			class="flex flex-col md:flex-row items-center justify-between text-gray-500 px-4 pt-2 pb-4 rounded-lg shadow space-x-0 md:space-x-4 space-y-4 md:space-y-0 dark:border dark:border-gray-700"
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
				<div class="w-full text-center text-lg font-semibold flex gap-2">
					<p>{{ $t('$.form.quantity') }}:</p>
					<p>{{ cart.quantity }}</p>
				</div>
				<div class="w-full text-center text-lg font-semibold flex gap-2">
					<p>{{ $t('$.form.price') }}:</p>
					<p>
						{{ useToNumber(cart?.total_price?.toFixed(2) || 0).value.toLocaleString(locale) }}&nbsp;{{
							$t('$.czk')
						}}
					</p>
				</div>
			</div>
		</div>
	</div>

	<div class="grid gap-2 sm:gap-4 my-8 md:grid-cols-2 lg:grid-cols-3">
		<div class="w-full border rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
			<div class="p-4 md:p-6 space-y-4">
				<h3 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
					{{ $t('$.cashdesk.billing_address') }}
				</h3>

				<div class="flex flex-col gap-y-2">
					<div>{{ store.user?.given_name }}&nbsp;{{ store.user?.family_name }}</div>
					<div>{{ store.user?.address?.main?.street }}</div>
					<div>{{ store.user?.address?.main?.city }}, {{ store.user?.address?.main?.postal_code }}</div>
					<div>{{ store.user?.address?.main?.state }}</div>
				</div>
			</div>
		</div>

		<div class="w-full border rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
			<div class="p-4 md:p-6 space-y-4">
				<h3 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
					{{ $t('$.cashdesk.delivery.title') }}
				</h3>

				<div class="flex flex-col gap-y-2">
					<div class="font-semibold">{{ $t(store.deliveries[store.delivery?.type]?.label) }}</div>
					<div>{{ store.user?.given_name }}&nbsp;{{ store.user?.family_name }}</div>
					<div>{{ store.delivery.address?.street }}</div>
					<div>{{ store.delivery.address?.city }}, {{ store.delivery.address?.postal_code }}</div>
					<div>{{ store.delivery.address?.state }}</div>
				</div>
			</div>
		</div>

		<div class="w-full border rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
			<div class="p-4 md:p-6 space-y-4">
				<h3 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
					{{ $t('$.cashdesk.payment.title') }}
				</h3>

				<div class="flex flex-col gap-y-2">
					<div class="font-semibold">{{ $t(store.payments[store.payment?.type]?.label) }}</div>
					<div>{{ store.payment.credit_card?.card_number }}</div>
					<div>{{ store.payment.credit_card?.expiration_date }}</div>
					<div>{{ store.payment.credit_card?.cvv }}</div>
					<div>{{ store.payment.credit_card?.card_number }}</div>
				</div>
			</div>
		</div>
	</div>

	<div
		class="py-4 px-4 mt-2 text-lg font-semibold text-end text-gray-600 border border-gray-200 dark:border-gray-700"
	>
		<div class="flex justify-end items-center gap-4">
			<p class="w-40 sm:w-44 text-left">{{ $t('$.cashdesk.delivery.title') }}:</p>
			<p class="w-32 sm:w-44 text-right">
				{{ useToNumber(store.delivery?.total_price?.toFixed(2) || 0).value.toLocaleString(locale) }}&nbsp;{{
					$t('$.czk')
				}}
			</p>
		</div>

		<div class="flex justify-end items-center gap-4">
			<p class="w-40 sm:w-44 text-left">{{ $t('$.cashdesk.payment.title') }}:</p>
			<p class="w-32 sm:w-44 text-right">
				{{ useToNumber(store.payment?.total_price?.toFixed(2) || 0).value.toLocaleString(locale) }}&nbsp;{{
					$t('$.czk')
				}}
			</p>
		</div>

		<div class="flex justify-end items-center gap-4">
			<p class="w-40 sm:w-44 text-left">{{ $t('$.cashdesk.cart.total_price') }}:</p>
			<p class="w-32 sm:w-44 text-right">
				{{ useToNumber(store.total_price?.toFixed(2) || 0).value.toLocaleString(locale) }}&nbsp;{{
					$t('$.czk')
				}}
			</p>
		</div>
	</div>
</template>
