<script setup lang="ts">
	import { useToNumber } from '@vueuse/core';

	import type { CartDocument } from '@/server/types/order.type';
	import type { WineDocument } from '@/server/types/wine.type';

	const props = defineProps<{
		item: WineDocument;
	}>();

	const { locale } = useI18n();
	const { routes } = useMenuItems();
	const { fields } = useWines();
	const cashdesk = useCashdeskStore();
	const modal: Ref<boolean> = ref(false);
	const cart: Ref<CartDocument | undefined> = ref();

	function addToCashdesk() {
		cart.value = cashdesk.addItem(props.item, 1);
		modal.value = true;
	}
</script>

<template>
	<div>
		<UCard :ui="{ shadow: 'shadow-md' }" class="zoom-in">
			<template #header>
				<NuxtImg
					:src="item.image?.main?.src || '/img/bottle.jpg'"
					:alt="'wine'"
					loading="lazy"
					format="webp"
					height="300"
					class="mx-auto"
				/>
			</template>

			<NuxtLink :to="`${routes.wine_detail?.path?.replace(':_id()', item._id)}`">
				<h3 class="text-lg lg:text-xl font-bold pb-4 text-primary-600 dark:text-primary-400">
					{{ item.name }}
				</h3>
			</NuxtLink>

			<template #footer>
				<div class="flex justify-between items-center">
					<div class="font-bold lg:text-lg text-gray-600 dark:text-white">
						{{ fields.price.label }}:&nbsp;{{
							useToNumber(item?.price?.toFixed(2) || 0).value.toLocaleString(locale)
						}}&nbsp;{{ $t('$.czk') }}
					</div>
					<UButton
						icon="i-heroicons-pencil-square"
						color="secondary"
						class="lg:text-lg dark:text-white"
						@click="addToCashdesk"
					>
						{{ $t('$.wine.to_cart') }}
					</UButton>
				</div>
			</template>
		</UCard>

		<UiModalCart v-model="modal">
			<div>
				<h3 class="font-medium text-xl lg:text-2xl text-gray-700 dark:text-primary-400">
					{{ cart?.wine?.name }}
				</h3>
				<div class="mt-6 flex flex-col gap-2">
					<div>
						{{ $t('$.form.price') }}:&nbsp;{{
							useToNumber(cart?.total_price?.toFixed(2) || 0).value.toLocaleString(locale)
						}}&nbsp;{{ $t('$.czk') }}
					</div>
					<div>
						{{ $t('$.form.quantity') }}:&nbsp;{{
							useToNumber(cart?.quantity || 1).value.toLocaleString(locale)
						}}&nbsp;{{ $t('$.czk') }}
					</div>
					<div>
						{{ $t('$.cashdesk.cart.total') }}:&nbsp;{{
							useToNumber(cashdesk?.total_price?.toFixed(2) || 0).value.toLocaleString(locale)
						}}&nbsp;{{ $t('$.czk') }}
					</div>
				</div>
			</div>
		</UiModalCart>
	</div>
</template>
