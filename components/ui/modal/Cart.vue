<script setup lang="ts">
	interface Btn {
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

	const { locale } = useI18n();
	const { routes } = useMenuItems();

	const model = defineModel();
</script>

<template>
	<UModal v-model="model">
		<UCard>
			<template #header>
				<div class="flex justify-between items-center">
					<h3 class="text-lg lg:text-xl font-bold text-primary-600 dark:text-primary-400">
						{{ $t('$.cashdesk.cart.title') }}
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
						:variant="btns?.cancel?.icon || 'outline'"
						@click="model = false"
					>
						{{ $t('$.btn.continue') }}
					</UButton>
					<UButton
						:to="routes.cashdesk.path"
						icon="i-heroicons-shopping-cart"
						color="primary"
						variant="solid"
						@click="model = false"
					>
						{{ $t('$.btn.to_order') }}
					</UButton>
				</div>
			</template>
		</UCard>
	</UModal>
</template>
