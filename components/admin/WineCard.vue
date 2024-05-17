<script setup lang="ts">
	import type { WineModel } from '@/server/models/wine.schema';

	defineProps<{
		item: WineModel;
	}>();

	const { fields } = useWines();
</script>

<template>
	<UCard :ui="{ shadow: 'shadow-md' }" class="zoom-in">
		<template #header>
			<NuxtImg src="/img/bottle.jpg" :alt="'wine'" loading="eager" format="webp" height="300" class="mx-auto" />
		</template>

		<div>
			<h3 class="text-lg lg:text-xl font-bold pb-4 text-primary-600 dark:text-primary-400">
				{{ item.name }}
			</h3>
			<p class=" text-gray-600 dark:text-white">{{ fields.kind.label }}: {{ item.kind }}</p>
			<p class=" text-gray-600 dark:text-white">{{ fields.color.label }}: {{ item.color }}</p>
			<p class=" text-gray-600 dark:text-white">{{ fields.quality.label }}: {{ item.quality }}</p>
			<p class=" text-gray-600 dark:text-white">{{ fields.variety.label }}: {{ item.variety }}</p>
			<p class=" text-gray-600 dark:text-white">{{ fields.volume.label }}: {{ item.volume }}</p>
			<p class=" text-gray-600 dark:text-white">{{ fields.year.label }}: {{ item.year }}</p>
		</div>

		<template #footer>
			<div class="flex justify-between items-center">
				<div class="font-bold  text-gray-600 dark:text-white">
					{{ fields.price.label }}: {{ item.price }} Kč
				</div>
				<UButton
					:to="'#'"
					icon="i-heroicons-pencil-square"
					color="secondary"
					class=" dark:text-white"
				>
					{{ $t('$.wine.to_cart') }}
				</UButton>
			</div>
		</template>
	</UCard>
</template>
