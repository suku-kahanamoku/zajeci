<script setup lang="ts">
	definePageMeta({
		layout: 'admin',
		syscode: 'admin',
		title: '$.dashboard.title',
	});

	const { t, locale } = useI18n();

	useHead({
		title: `${t('$.base.title')} | ${t('$.dashboard.title')}`,
		meta: [
			{ name: 'description', content: t('$.base.description') },
			{ name: 'keywords', content: t('$.base.description') },
		],
	});
</script>

<template>
	<div class="max-w-screen-xl w-full mx-auto px-5 py-5 flex flex-col gap-10">
		<h1 class="text-center text-primary-600 text-4xl lg:text-5xl font-bold tracking-tight dark:text-primary-400">
			{{ $t('$.dashboard.title') }}
		</h1>
		dashboard
	</div>
</template>
