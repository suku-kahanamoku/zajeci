<script setup lang="ts">
	definePageMeta({
		layout: 'default',
		syscode: 'home',
		title: '$.home.title',
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
		<CustomIntro />
		<UDivider />
		<CustomAbout />
		<UDivider />
		<CustomProduct />
		<UDivider />
		<CustomTasting />
		<UDivider />
		<CustomContact />
	</div>
</template>
