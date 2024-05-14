<script setup lang="ts">
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
	<div id="wine" class="py-10 lg:py-16">
		<div class="text-center pb-8 lg:pb-10">
			<h2 class="text-primary-600 text-4xl lg:text-5xl font-bold tracking-tight dark:text-primary-400">
				{{ $t('$.wine.title') }}
			</h2>
		</div>

		<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 py-4">
			<UiWineCard v-for="wine of wines" :item="wine" />
		</div>
	</div>
</template>
