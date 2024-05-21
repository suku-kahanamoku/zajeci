<template>
	<div id="about" class="py-10 lg:py-16">
		<div class="text-center pb-8 lg:pb-10">
			<h2 class="text-primary-600 text-4xl lg:text-5xl font-bold tracking-tight dark:text-primary-400">
				{{ $t('$.about.title') }}
			</h2>
			<h3 class="pt-8 text-xl lg:text-3xl font-bold text-gray-600 dark:text-gray-400">
				{{ $t('$.about.subtitle') }}
			</h3>
		</div>

		<div class="from-bottom text-center lg:text-lg text-gray-600 dark:text-white">{{ $t('$.about.description') }}</div>
	</div>
</template>
