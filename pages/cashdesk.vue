<script setup lang="ts">
	import PhotoSwipeLightbox from 'photoswipe/lightbox';
	import 'photoswipe/style.css';

	definePageMeta({
		layout: 'default',
		syscode: 'cashdesk',
		title: '$.cashdesk.title',
	});

	const { t } = useI18n();

	useHead({
		title: `${t('$.base.title')} | ${t('$.login.title')}`,
		meta: [
			{ name: 'description', content: t('$.base.description') },
			{ name: 'keywords', content: t('$.base.description') },
		],
	});

	const items = [
		{
			key: 'cart',
			label: t('$.cashdesk.cart.title'),
		},
		{
			key: 'delivery_payment',
			label: t('$.cashdesk.delivery_payment'),
		},
		{
			key: 'summary',
			label: t('$.cashdesk.summary'),
		},
	];

	const route = useRoute();
	const router = useRouter();

	const selected = computed({
		get() {
			const index = items.findIndex((item) => item.label === route.query.tab);
			if (index === -1) {
				return 0;
			}

			return index;
		},
		set(value) {
			// Hash is specified here to prevent the page from scrolling to the top
			router.replace({ query: { tab: items[value].label } });
		},
	});
</script>

<template>
	<div class="max-w-screen-xl mx-auto px-5 w-full">
		<div id="gallery" class="py-10">
			<h1
				class="text-center text-primary-600 text-4xl lg:text-5xl font-bold tracking-tight dark:text-primary-400"
			>
				{{ $t('$.cashdesk.title') }}
			</h1>
			<div class="py-10">
				<UTabs v-model="selected" :items="items">
					<template #item="{ item }">
						<div class="py-4">
							<CustomCashdeskCart v-if="item.key === 'cart'" />
							<CustomCashdeskDeliveryPayment v-else-if="item.key === 'delivery_payment'" />
							<CustomCashdeskSummary v-else-if="item.key === 'summary'" />
						</div>
					</template>
				</UTabs>
			</div>
		</div>
	</div>
</template>
