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
	<div class="max-w-screen-xl w-full mx-auto px-5 py-5 flex flex-col gap-10">
		<h1 class="text-center text-primary-600 text-4xl lg:text-5xl font-bold tracking-tight dark:text-primary-400">
			{{ $t('$.terms_conditions.title') }}
		</h1>
	</div>
</template>
