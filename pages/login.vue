<script setup lang="ts">
	definePageMeta({
		layout: 'default',
		syscode: 'login',
		title: '$.navbar.login',
	});

	const { t } = useI18n();

	useHead({
		title: `${t('$.base.title')} | ${t('$.login.title')}`,
		meta: [
			{ name: 'description', content: t('$.base.description') },
			{ name: 'keywords', content: t('$.base.description') },
		],
	});
</script>

<template>
	<div class="flex w-full">
		<div class="flex items-center justify-center mx-auto w-full">
			<CustomFormLogin />
		</div>
	</div>
</template>
