<script setup lang="ts">
	interface Btn {
		label?: string;
		icon?: string;
		color?: string;
		variant?: string;
	}

	const props = defineProps<{
		btns?: {
			cancel?: Btn;
			ok?: Btn;
		};
	}>();

	const emits = defineEmits<{
		(e: 'confirm', value: any): void;
	}>();

	const model = defineModel();

	watch(model, (value) => {
		if (value === false) {
			emits('confirm', false);
		}
	});
</script>

<template>
	<UModal v-model="model">
		<UCard>
			<template #header>
				<div class="flex justify-between items-center">
					<h3 class="text-lg lg:text-xl font-bold text-primary-600 dark:text-primary-400">
						<slot name="header"></slot>
					</h3>
					<UButton
						icon="i-heroicons-x-mark"
						color="white"
						square
						variant="solid"
						:aria-label="$t('$.aria.close')"
						@click="model = false"
					/>
				</div>
			</template>

			<slot></slot>

			<template #footer>
				<div class="flex justify-between">
					<UButton
						:icon="btns?.cancel?.icon || 'i-heroicons-arrow-left'"
						:color="btns?.cancel?.color || 'gray'"
						:variant="btns?.cancel?.variant || 'outline'"
						@click="model = false"
					>
						{{ $t(btns?.cancel?.label || '$.btn.cancel') }}
					</UButton>
					<UButton
						:icon="btns?.ok?.icon || 'i-heroicons-trash'"
						:color="btns?.ok?.color || 'red'"
						:variant="btns?.ok?.variant || 'solid'"
						@click="
							emits('confirm', true);
							model = false;
						"
					>
						{{ $t(btns?.ok?.label || '$.btn.delete') }}
					</UButton>
				</div>
			</template>
		</UCard>
	</UModal>
</template>
