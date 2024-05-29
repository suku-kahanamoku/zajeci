<script setup lang="ts">
	import { object, string } from 'yup';
	import { useToNumber } from '@vueuse/core';
	import { useDebounceFn } from '@vueuse/core';

	const { t, locale } = useI18n();
	const store = useCashdeskStore();
	const formEl = ref();

	const schema = object({
		type: string().required(' '),
	});

	watch(
		store.payment,
		useDebounceFn(async (value) => {
			if (store.payment) {
				store.payment.total_price = store.payments[store.payment.type]?.price || 0;
				try {
					await formEl.value.validate();
					store.payment.valid = true;
				} catch (error) {
					store.payment.valid = false;
				}
			}
		}, 400)
	);
</script>
<template>
	<UForm
		ref="formEl"
		:schema="schema"
		:state="store.payment"
		class="w-full border rounded-lg shadow-md my-4 dark:border dark:bg-gray-800 dark:border-gray-700"
	>
		<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
			<UFormGroup name="type">
				<template #label>
					<h3
						class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
					>
						{{ $t(store.fields.payment.label) }}
					</h3>
				</template>
				<div class="pt-2">
					<URadio
						v-for="option of store.paymentOptions"
						:key="option.value"
						v-model="store.payment.type"
						:value="option.value"
						:disabled="option?.disabled"
						:ui="{
							wrapper: 'items-center py-1',
							base: option.disabled ? 'cursor-not-allowed' : 'cursor-pointer',
							inner: 'w-full',
							label: option.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
						}"
					>
						<template #label>
							<div class="flex items-center justify-between w-full">
								<div class="flex items-center gap-2">
									<Icon :name="option.avatar as string" size="30" class="w-20" />
									<span>
										{{ $t(option?.label) }}
									</span>
								</div>
								<span v-if="option.price! > 0">
									{{
										useToNumber(option?.price?.toFixed(2) || 0).value.toLocaleString(locale)
									}}&nbsp;{{ $t('$.czk') }}
								</span>
								<span v-else>
									{{ $t('$.btn.free') }}
								</span>
							</div>
						</template>
					</URadio>
				</div>
			</UFormGroup>
		</div>
	</UForm>
</template>
