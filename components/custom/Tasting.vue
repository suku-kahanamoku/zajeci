<script setup lang="ts">
	const tasting = [
		{
			name: '$.tasting.basic.title',
			price: {
				value: '250 Kč / osoba',
			},
			popular: false,
			features: [
				{ label: '$.tasting.basic.drink', icon: 'ph:wine-duotone' },
				{ label: '$.tasting.basic.food', icon: 'icon-park-outline:bread' },
				{ label: '$.tasting.basic.time', icon: 'ion:hourglass-outline' },
			],
		},
		{
			name: '$.tasting.standard.title',
			price: {
				value: '500 Kč / osoba',
			},
			popular: true,
			features: [
				{ label: '$.tasting.standard.drink', icon: 'ph:wine-duotone' },
				{ label: '$.tasting.standard.food', icon: 'icon-park-outline:bread' },
				{ label: '$.tasting.standard.time', icon: 'ion:hourglass-outline' },
			],
		},
		{
			name: '$.tasting.premium.title',
			price: {
				value: '900 Kč / osoba',
			},
			popular: false,
			features: [
				{ label: '$.tasting.premium.drink', icon: 'ph:wine-duotone' },
				{ label: '$.tasting.premium.food', icon: 'icon-park-outline:bread' },
				{ label: '$.tasting.premium.time', icon: 'ion:hourglass-outline' },
			],
		},
	];
</script>

<template>
	<div id="tasting" class="py-10 lg:py-16">
		<div class="text-center pb-8 lg:pb-10">
			<h2 class="text-primary-600 text-4xl lg:text-5xl font-bold tracking-tight dark:text-primary-400">
				{{ $tt('$.tasting.title') }}
			</h2>
		</div>

		<div class="grid md:grid-cols-3 gap-6 lg:gap-10 justify-center mx-auto max-w-screen-lg py-4">
			<div
				v-for="(item, index) of tasting"
				class="zoom-in col-auto"
				:class="{ 'sm:col-span-2 md:col-auto': index === 2 }"
			>
				<div class="h-full border-2 border-gray-300 border-opacity-50 py-5 px-6 rounded-md bg-white dark:bg-gray-900 transition-transform transform lg:hover:scale-110">
					<div class="text-center">
						<h3 class="mt-3 text-2xl lg:text-3xl font-bold text-gray-900 dark:text-primary-300">
							{{ $tt(item.name) }}
						</h3>
						<p class="mt-2 text-gray-600 dark:text-gray-300">
							{{ item.price && typeof item.price === 'object' ? item.price.value : item.price }}
						</p>
					</div>
					<ul class="grid mt-8 text-left gap-4">
						<li
							v-for="feature of item.features"
							class="flex items-center gap-3 text-gray-600 dark:text-white"
						>
							<div>
								<Icon class="text-secondary-400" :name="feature.icon" size="32" />
							</div>
							<div class="font-semibold lg:text-lg">{{ $tt(feature.label) }}</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>
