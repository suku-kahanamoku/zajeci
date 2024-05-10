<script setup lang="ts">
	const expires = new Date();
	expires.setFullYear(expires.getFullYear() + 1);

	const control = useCookie('_cookies', { expires });
	const isOpen = ref(control.value ? false : true);
</script>

<template>
	<div v-if="isOpen" class="fixed bottom-0 w-full bg-gray-800 text-white p-4">
		<div class="max-w-screen-lg mx-auto flex items-center justify-between gap-4">
			<div class="inline">
				<Icon name="mdi:cookie" size="36" class="inline text-secondary-400" />
			</div>
			<p class="text-sm pe-4">
				{{ $t('$.footer.cookies') }}
			</p>
			<UButton
				color="secondary"
				@click="
					control = '1';
					isOpen = false;
				"
				>Zavřít</UButton
			>
		</div>
	</div>
</template>
