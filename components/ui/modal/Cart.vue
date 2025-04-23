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

	const localePath = useLocalePath();
	const { routes } = useMenuItems();

	const model = defineModel();
</script>

<template>
	<UModal v-model="model">
		<UCard>
			<template #header>
				<div class="flex justify-between items-center">
					<h3 class="text-lg lg:text-xl font-bold text-primary-600 dark:text-primary-400">
						{{ $tt('$.cashdesk.cart.added') }}
					</h3>
					<UButton
						icon="i-heroicons-x-mark"
						color="white"
						square
						variant="solid"
						:aria-label="$tt('$.aria.close')"
						@click="model = false"
					/>
				</div>
			</template>

			<slot></slot>

			<template #footer>
				<div class="flex justify-between items-center">
					<div>
						<UButton
							:icon="btns?.cancel?.icon || 'i-heroicons-arrow-left'"
							:color="btns?.cancel?.color || 'gray'"
							:variant="btns?.cancel?.icon || 'outline'"
							size="lg"
							@click="model = false"
						>
							<span class="hidden sm:block">
								{{ $tt('$.btn.continue') }}
							</span>
						</UButton>
					</div>
					<UButton
						:to="localePath(routes.cashdesk.path)"
						icon="i-heroicons-shopping-cart"
						color="primary"
						variant="solid"
						size="xl"
						@click="model = false"
					>
						{{ $tt('$.btn.to_order') }}
					</UButton>
				</div>
			</template>
		</UCard>
	</UModal>
</template>
