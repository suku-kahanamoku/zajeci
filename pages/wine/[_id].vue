<script setup lang="ts">
	import { useDateFormat, useToNumber } from '@vueuse/core';

	import type { WineModel } from '@/server/models/wine.schema';

	definePageMeta({
		layout: 'default',
		syscode: 'wine_detail',
		title: '$.wine.detail.title',
	});

	const { t, locale } = useI18n();
	const route = useRoute();
	const { fields, kinds, colors } = useWines();

	useHead({
		title: `${t('$.base.title')} | ${t('$.forgot_password.title')}`,
		meta: [
			{ name: 'description', content: t('$.base.description') },
			{ name: 'keywords', content: t('$.base.description') },
		],
	});

	const { data: wine, pending } = await useAsyncData(async () => {
		try {
			return await $fetch(`/api/wine/${route.params._id}`);
		} catch (error: any) {
			console.error(error);
		}
	});
</script>

<template>
	<section class="text-gray-700 body-font overflow-hidden bg-white">
		<div class="px-5 py-24 mx-auto">
			<div class="lg:w-4/5 mx-auto flex flex-wrap">
				<NuxtImg
					src="/img/bottle.jpg"
					:alt="'wine'"
					loading="eager"
					format="webp"
					height="600"
					class="mx-auto"
				/>
				<div class="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
					<h1 class="text-gray-900 text-3xl title-font font-medium mb-1">{{ wine?.name }}</h1>
					<div class="flex mb-4">
						<span class="flex items-center">
							<svg
								fill="currentColor"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								class="w-4 h-4 text-red-500"
								viewBox="0 0 24 24"
							>
								<path
									d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
								></path>
							</svg>
							<svg
								fill="currentColor"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								class="w-4 h-4 text-red-500"
								viewBox="0 0 24 24"
							>
								<path
									d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
								></path>
							</svg>
							<svg
								fill="currentColor"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								class="w-4 h-4 text-red-500"
								viewBox="0 0 24 24"
							>
								<path
									d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
								></path>
							</svg>
							<svg
								fill="currentColor"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								class="w-4 h-4 text-red-500"
								viewBox="0 0 24 24"
							>
								<path
									d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
								></path>
							</svg>
							<svg
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								class="w-4 h-4 text-red-500"
								viewBox="0 0 24 24"
							>
								<path
									d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
								></path>
							</svg>
							<span class="text-gray-600 ml-3">4 Reviews</span>
						</span>
						<span class="flex ml-3 pl-3 py-2 border-l-2 border-gray-200">
							<UButton variant="ghost" :ui="{ rounded: 'rounded-full' }">
								<Icon name="logos:facebook" size="20" />
							</UButton>
							<UButton variant="ghost" :ui="{ rounded: 'rounded-full' }">
								<Icon name="logos:twitter" size="20" />
							</UButton>
							<UButton variant="ghost" :ui="{ rounded: 'rounded-full' }">
								<Icon name="mdi:chat-processing-outline" size="20" />
							</UButton>
						</span>
					</div>
					<p class="leading-relaxed">
						{{ wine?.description }}
					</p>
					<div class="leading-relaxed mt-4">
						<p class="text-gray-600 dark:text-white">
							{{ fields.kind.label }}: {{ kinds[wine?.kind as string]?.label }}
						</p>
						<p class="text-gray-600 dark:text-white">
							{{ fields.color.label }}: {{ colors[wine?.color as string]?.label }}
						</p>
						<p class="text-gray-600 dark:text-white">{{ fields.quality.label }}: {{ wine?.quality }}</p>
						<p class="text-gray-600 dark:text-white">{{ fields.variety.label }}: {{ wine?.variety }}</p>
						<p class="text-gray-600 dark:text-white">{{ fields.volume.label }}: {{ wine?.volume }}</p>
						<p class="text-gray-600 dark:text-white">{{ fields.year.label }}: {{ wine?.year }}</p>
					</div>
					<UDivider class="my-4" />
					<div class="flex items-center justify-between">
						<span class="title-font font-medium text-2xl text-gray-900">
							{{ useToNumber(wine?.price?.toFixed(2) || 0).value.toLocaleString(locale) }}&nbsp;{{
								$t('$.czk')
							}}
						</span>
						<div>
							<UButton
								:to="'#'"
								icon="i-heroicons-pencil-square"
								color="secondary"
								class="lg:text-lg dark:text-white"
							>
								{{ $t('$.wine.to_cart') }}
							</UButton>
							<UButton
								icon="i-heroicons-heart"
								color="gray"
								class="ml-4"
								size="lg"
								:ui="{ rounded: 'rounded-full' }"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
