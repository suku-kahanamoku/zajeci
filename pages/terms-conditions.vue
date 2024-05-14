<script setup lang="ts">
	definePageMeta({
		layout: 'default',
		syscode: 'terms_conditions',
		title: '$.terms_conditions.title',
	});

	const { t } = useI18n();

	useHead({
		title: t('$.base.title'),
		meta: [
			{ name: 'description', content: t('$.base.description') },
			{ name: 'keywords', content: t('$.base.description') },
		],
	});
</script>

<template>
	<div class="max-w-screen-xl mx-auto px-5 w-full">
		<div id="terms" class="py-10">
			<h1
				class="text-center text-primary-600 text-4xl lg:text-5xl font-bold tracking-tight dark:text-primary-400 pb-8"
			>
				{{ $t('$.terms_conditions.title') }}
			</h1>
		</div>
	</div>
</template>
