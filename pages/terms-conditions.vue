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
	fsda
</template>
