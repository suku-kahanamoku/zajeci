<script setup lang="ts">
	definePageMeta({
		layout: 'default',
		syscode: 'forgot_password',
		title: '$.forgot_password.title',
	});

	const { t } = useI18n();

	useHead({
		title: `${t('$.base.title')} | ${t('$.forgot_password.title')}`,
		meta: [
			{ name: 'description', content: t('$.base.description') },
			{ name: 'keywords', content: t('$.base.description') },
		],
	});
</script>

<template>
	<div class="flex w-full">
		<div class="flex items-center justify-center mx-auto w-full">
			<CustomFormForgotPassword />
		</div>
	</div>
</template>
