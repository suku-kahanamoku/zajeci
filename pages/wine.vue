<script setup lang="ts">
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

	const wines = [
		{
			name: 'Frankovka',
			price: 170,
			kind: 'Červené suché',
			type: 'Moravské zemské víno',
		},
		{
			name: 'Rulandské modré',
			price: 250,
			kind: 'Červené suché',
			type: 'Moravské zemské víno',
		},
		{
			name: 'Cabernet Moravia rosé',
			price: 150,
			kind: 'Růžové suché',
			type: 'Moravské zemské víno',
		},
		{
			name: 'Müller-Thurgau',
			price: 220,
			kind: 'Bílé supolosuchéché',
			type: 'Moravské zemské víno',
		},
		{
			name: 'Rulandské bílé',
			price: 200,
			kind: 'Bílé suché',
			type: 'Moravské zemské víno',
		},
	];
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
