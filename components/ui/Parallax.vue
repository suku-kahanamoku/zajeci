<script setup lang="ts">
	import Ukiyo from 'ukiyojs';

	defineProps(['src']);

	const parallax = ref();

	onMounted(() => {
		new Ukiyo(parallax.value, { speed: 2 });
	});
</script>

<template>
	<div ref="parallax" class="parallax absolute top-0 left-0 -z-10" :style="{ 'background-image': `url(${src})` }">
		<div class="overlay"></div>
	</div>
</template>

<style scoped>
	.parallax {
		background-repeat: no-repeat;
		background-size: cover;
		width: 100%;
		height: 100%;
	}
	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(46, 48, 70, 0.6);
	}

	@media (min-width: 768px) {
		.overlay {
			background: linear-gradient(to right, rgba(46, 48, 70, 0.6), transparent);
		}
	}
</style>
