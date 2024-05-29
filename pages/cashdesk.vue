<script setup lang="ts">
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

	const store = useCashdeskStore();

	const tabs = ref([
		{
			key: 'cart',
			label: t('$.cashdesk.cart.title'),
		},
		{
			key: 'delivery_payment',
			label: t('$.cashdesk.delivery_payment'),
			disabled: computed(() => !store.carts?.length),
		},
		{
			key: 'summary',
			label: t('$.cashdesk.summary'),
			disabled: computed(
				() => !store.carts?.length || !store.user?.valid || !store.delivery.valid || !store.payment.type
			),
		},
	]);

	const route = useRoute();
	const router = useRouter();
	const { routes } = useMenuItems();

	const selected = computed({
		get() {
			const index = tabs.value.findIndex((item) => item.label === route.query.tab);
			if (index === -1 || tabs.value[index]?.disabled) {
				return 0;
			}

			return index;
		},
		set(value) {
			// Hash is specified here to prevent the page from scrolling to the top
			router.replace({ query: { tab: tabs.value[value].label } });
		},
	});

	const backBtn = ['$.btn.back_shopping', '$.cashdesk.cart.title', '$.cashdesk.delivery_payment'];
	const continueBtn = ['$.cashdesk.delivery_payment', '$.cashdesk.summary', '$.btn.complete_order'];
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
				<client-only>
					<UTabs v-model="selected" :items="tabs">
						<template #item="{ item }">
							<div class="py-4">
								<CustomCashdeskCart v-if="item.key === 'cart'" />
								<CustomCashdeskDeliveryPayment v-else-if="item.key === 'delivery_payment'" />
								<CustomCashdeskSummary v-else-if="item.key === 'summary'" />
							</div>
						</template>
					</UTabs>

					<div class="flex justify-between mt-8">
						<UButton
							:to="selected < 1 ? routes.wine.path : undefined"
							icon="i-heroicons-arrow-left"
							color="white"
							size="lg"
							@click="selected ? (selected -= 1) : undefined"
						>
							<span class="hidden sm:block">
								{{ $t(backBtn[selected] || '$.btn.back') }}
							</span>
						</UButton>
						<UButton size="lg" :disabled="tabs[selected + 1]?.disabled" @click="selected += 1">
							{{ $t(continueBtn[selected] || '$.btn.continue') }}
							<template #trailing>
								<UIcon name="i-heroicons-arrow-right-20-solid" class="w-5 h-5" />
							</template>
						</UButton>
					</div>
				</client-only>
			</div>
		</div>
	</div>
</template>
