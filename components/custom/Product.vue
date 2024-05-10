<script setup lang="ts">
	const products = [
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
	<div id="product" class="py-10 lg:py-16">
		<div class="text-center pb-8 lg:pb-10">
			<h2 class="text-primary-600 text-4xl lg:text-5xl font-bold tracking-tight dark:text-primary-400">
				{{ $t('$.product.title') }}
			</h2>
		</div>

		<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 py-4">
			<UCard v-for="item of products" :ui="{ shadow: 'shadow-md' }" class="zoom-in">
				<template #header>
					<NuxtImg
						src="/img/bottle.jpg"
						:alt="'product'"
						loading="eager"
						format="webp"
						height="300"
						class="mx-auto"
					/>
				</template>

				<div>
					<h3 class="text-lg lg:text-xl font-bold pb-4 text-primary-600 dark:text-primary-400">
						{{ item.name }}
					</h3>
					<p class="lg:text-lg text-gray-600 dark:text-white">Druh vína: {{ item.kind }}</p>
					<p class="lg:text-lg text-gray-600 dark:text-white">Sběr: {{ item.type }}</p>
				</div>

				<template #footer>
					<div class="flex justify-between items-center">
						<div class="font-bold lg:text-lg text-gray-600 dark:text-white">Cena: {{ item.price }} Kč</div>
						<UButton
							:to="'#'"
							icon="i-heroicons-pencil-square"
							color="secondary"
							class="lg:text-lg dark:text-white"
						>
							{{ $t('$.product.to_cart') }}
						</UButton>
					</div>
				</template>
			</UCard>
		</div>
	</div>
</template>
