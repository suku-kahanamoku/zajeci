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
		<div class="w-full dark:border dark:border-gray-700">
			<client-only>
				fsda
			</client-only>
		</div>
		<div class="w-full flex flex-col lg:flex-row gap-10 justify-between">
			<div class="w-full dark:border dark:border-gray-700">
				fdsa
			</div>
			<div class="w-full dark:border dark:border-gray-700">
				<client-only>
					fdsa
				</client-only>
			</div>
		</div>
	</div>
</template>
