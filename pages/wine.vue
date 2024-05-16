<script setup lang="ts">
	import type { WineModel } from '@/server/models/wine.schema';

	definePageMeta({
		layout: 'default',
		syscode: 'wine',
		title: '$.wine.title',
	});

	const { t } = useI18n();

	useHead({
		title: t('$.base.title'),
		meta: [
			{ name: 'description', content: t('$.base.description') },
			{ name: 'keywords', content: t('$.base.description') },
		],
	});

	const route = useRoute();

	const { data: wines } = await useAsyncData(
		async (): Promise<WineModel[] | undefined> => {
			try {
				return await $fetch(`/api/wine`);
			} catch (error: any) {
				console.error(error);
			}
		},
		{ watch: [route] }
	);
</script>

<template>
	<div class="max-w-screen-xl mx-auto px-5 w-full">
		<div id="terms" class="py-10">
			<h1
				class="text-center text-primary-600 text-4xl lg:text-5xl font-bold tracking-tight dark:text-primary-400 pb-8"
			>
				{{ $t('$.wine.title') }}
			</h1>

			<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 py-4">
				<UiWineCard v-for="wine of wines" :item="wine" />
			</div>
		</div>
	</div>
</template>
