<script setup lang="ts">
	defineProps(['item']);
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
					{{ $t('$.wine.to_cart') }}
				</UButton>
			</div>
		</template>
	</UCard>
</template>
