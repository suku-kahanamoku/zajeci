<script setup lang="ts">
	const { routes } = useMenuItems();
	const localePath = useLocalePath();
</script>
<template>
	<div id="intro" class="grid lg:grid-cols-2 place-items-center py-12 lg:py-14">
		<div class="lg:order-1 hidden lg:block">
			<NuxtImg
				class="rounded-md transition-transform transform scale-90 hover:scale-100"
				src="/img/intro.jpg"
				:alt="$t('$.intro.intro_alt')"
				loading="eager"
				format="webp"
				width="512"
				height="512"
			/>
		</div>

		<div class="from-left">
			<h1 class="text-5xl lg:text-6xl font-bold tracking-tight text-primary-600 dark:text-primary-400">
				{{ $t('$.intro.title') }}
			</h1>
			<p class="lg:text-lg mt-8 text-gray-600 max-w-xl dark:text-white">
				{{ $t('$.intro.subtitle') }}
			</p>
			<UButton
				:to="localePath('/#product')"
				color="secondary"
				class="mt-10 md:text-lg lg:text-xl dark:text-white"
				>{{ $t('$.intro.btn') }}</UButton
			>
		</div>
	</div>
</template>
