<script setup lang="ts">
	import PhotoSwipeLightbox from 'photoswipe/lightbox';
	import 'photoswipe/style.css';

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
</script>

<template>
	<div class="max-w-screen-xl mx-auto px-5 w-full">
		<div id="gallery" class="py-10">
			<h1
				class="text-center text-primary-600 text-4xl lg:text-5xl font-bold tracking-tight dark:text-primary-400"
			>
				{{ $t('$.cashdesk.title') }}
			</h1>
		</div>
	</div>
</template>
