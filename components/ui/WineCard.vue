<script setup lang="ts">
	import { useDateFormat, useToNumber } from '@vueuse/core';

	import type { WineModel } from '@/server/models/wine.schema';

	defineProps<{
		item: WineModel;
	}>();

	const { locale } = useI18n();
	const { routes } = useMenuItems();
	const { fields } = useWines();
</script>

<template>
	<UCard :ui="{ shadow: 'shadow-md' }" class="zoom-in">
		<template #header>
			<NuxtImg src="/img/bottle.jpg" :alt="'wine'" loading="eager" format="webp" height="300" class="mx-auto" />
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
				<UButton icon="i-heroicons-pencil-square" color="secondary" class="lg:text-lg dark:text-white">
					{{ $t('$.wine.to_cart') }}
				</UButton>
			</div>
		</template>
	</UCard>
</template>
