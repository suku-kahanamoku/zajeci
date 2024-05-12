<script setup lang="ts">
	definePageMeta({
		layout: 'default',
		syscode: 'gallery',
		title: '$.navbar.gallery',
	});

	const { t } = useI18n();

	useHead({
		title: `${t('$.base.title')} | ${t('$.login.title')}`,
		meta: [
			{ name: 'description', content: t('$.base.description') },
			{ name: 'keywords', content: t('$.base.description') },
		],
	});

	const { data } = await useAsyncData(async () => {
		try {
			return (await $fetch(`/api/gallery`)) as any;
		} catch (error: any) {
			console.error(error);
		}
	});
</script>

<template>
	<div class="flex w-full">
		<div class="max-w-screen-xl mx-auto px-5 w-full">
			<div id="gallery" class="d-flex grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10 items-center">
				<div
					v-for="path of data"
					class="from-bottom flex border-2 border-[#D8DEE9] rounded-md overflow-hidden sm:max-h-60 shadow-sm hover:shadow-lg items-center align-middle justify-center justify-items-center"
				>
					<NuxtImg :src="`/gallery/${path}`" alt="gallery img" loading="eager" format="webp" width="300" />
				</div>
			</div>
		</div>
	</div>
</template>
