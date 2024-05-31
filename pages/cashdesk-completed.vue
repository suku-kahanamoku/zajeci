<script setup lang="ts">
	definePageMeta({
		layout: 'default',
		syscode: 'cashdesk_completed',
		title: '$.cashdesk_completed.title',
	});

	const { t } = useI18n();

	useHead({
		title: `${t('$.base.title')} | ${t('$.login.title')}`,
		meta: [
			{ name: 'description', content: t('$.base.description') },
			{ name: 'keywords', content: t('$.base.description') },
		],
	});

	const route = useRoute();
	const { routes } = useMenuItems();
	const localePath = useLocalePath();
</script>

<template>
	<div class="max-w-screen-xl mx-auto px-5 w-full">
		<div id="cashdesk-completed" class="py-10">
			<div class="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
				<h1 class="text-2xl font-bold text-gray-800 mb-4">{{ $t('$.cashdesk_completed.title') }}</h1>
				<p
					class="text-gray-700 mb-4"
					v-html="$t('$.cashdesk_completed.order', { orderId: `<strong>${route.query.orderId}</strong>` })"
				/>
				<p
					class="text-gray-700 mb-4"
					v-html="
						$t('$.cashdesk_completed.send_to_email', { email: `<strong>${route.query.email}</strong>` })
					"
				/>
				<p class="text-gray-700">{{ $t('$.cashdesk_completed.thank_you') }}</p>
				<UButton class="mt-6" :to="localePath(routes.wine.path)" icon="i-heroicons-arrow-left">
					{{ $t('$.btn.back_shopping') }}
				</UButton>
			</div>
		</div>
	</div>
</template>
