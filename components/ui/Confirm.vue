<script setup lang="ts">
	interface Btn {
		icon?: string;
		color?: string;
		variant?: string;
	}

	const props = defineProps<{
		message?: string;
		btns?: {
			cancel?: Btn;
			ok?: Btn;
		};
	}>();

	const emits = defineEmits<{
		(e: 'confirm', value: any): void;
	}>();

	const model = defineModel();
</script>

<template>
	<UModal v-model="model">
		<UCard>
			<template #header>
				<div class="flex justify-end">
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

			{{ message }}

			<template #footer>
				<div class="flex justify-between">
					<UButton
						:icon="btns?.cancel?.icon || 'i-heroicons-arrow-left'"
						:color="btns?.cancel?.color || 'gray'"
						:variant="btns?.cancel?.icon || 'outline'"
						@click="model = false"
					>
						{{ $t('$.btn.cancel') }}
					</UButton>
					<UButton
						icon="i-heroicons-trash"
						color="red"
						variant="solid"
						@click="
							emits('confirm', true);
							model = false;
						"
					>
						{{ $t('$.btn.delete') }}
					</UButton>
				</div>
			</template>
		</UCard>
	</UModal>
</template>
