<script setup lang="ts">
	import { filename } from 'pathe/utils';
	import sizeOf from 'image-size';
	import PhotoSwipeLightbox from 'photoswipe/lightbox';
	import 'photoswipe/style.css';

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

	const glob = import.meta.glob('@/public/gallery/*', { eager: true });
	const images = Object.fromEntries(
		Object.entries(glob).map(([key, value]) => {
			const imgSrc = (value as any).default;
			const name = filename(key);
			const rootPath = process.cwd(); // nebo použijte alias: const rootPath = '@/';
			const dimensions = sizeOf(`${rootPath}/public/gallery/${name}.jpg`);
			return [name, { src: imgSrc, width: dimensions.width, height: dimensions.height }];
		})
	);

	const data = Object.values(images);
	console.log(data);
	const lightbox = ref();

	onMounted(() => {
		lightbox.value = new PhotoSwipeLightbox({
			gallery: '#gallery',
			children: 'a',
			pswpModule: () => import('photoswipe'),
			spacing: 0.5,
			loop: false,
		});
		lightbox.value.init();
	});

	onUnmounted(() => {
		if (lightbox.value) {
			lightbox.value.destroy();
			lightbox.value = null;
		}
	});
</script>

<template>
	<div class="flex w-full">
		<div class="max-w-screen-xl mx-auto px-5 w-full">
			<div id="gallery" class="d-flex grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10 items-center">
				<a
					v-for="img of data"
					:href="img.src"
					target="_blank"
					rel="noreferrer"
					class="flex border-2 border-[#D8DEE9] rounded-md overflow-hidden sm:max-h-60 shadow-sm hover:shadow-lg items-center align-middle justify-center justify-items-center"
					:data-pswp-width="img.width"
					:data-pswp-height="img.height"
				>
					<img :src="img.src" alt="Gallery img" loading="lazy" format="webp" width="300" />
				</a>
			</div>
		</div>
	</div>
</template>
