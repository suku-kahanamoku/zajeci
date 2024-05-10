<script setup lang="ts">
	const { routes } = useMenuItems();
	const localePath = useLocalePath();
</script>
<template>
	<div id="intro" class="overflow-hidden relative place-items-center py-24 lg:py-48 px-8 lg:px-12">
		<div class="from-left max-w-screen-xl mx-auto w-full">
			<h1 class="text-5xl lg:text-6xl font-bold tracking-tight text-white">
				{{ $t('$.intro.title') }}
			</h1>
			<p class="lg:text-lg mt-8 max-w-xl text-white">
				{{ $t('$.intro.subtitle') }}
			</p>
			<UButton :to="localePath('/#product')" color="secondary" class="mt-10 md:text-lg lg:text-xl dark:text-white">{{
				$t('$.intro.btn')
			}}</UButton>
		</div>
		<UiParallax src="/img/intro.jpg" />
	</div>
</template>
