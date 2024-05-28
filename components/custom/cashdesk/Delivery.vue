<script setup lang="ts">
	import { object, string } from 'yup';
	import type { DeliveryDocument } from '@/server/types/order.type';
	import { useToNumber } from '@vueuse/core';
	import { useDebounceFn } from '@vueuse/core';

	const { t, locale } = useI18n();
	const store = useCashdeskStore();
	const formEl = ref();

	const schema = object({
		type: string().required(' '),
		address: object({
			street: string().required(' '),
			city: string().required(' '),
			postal_code: string().required(' ').matches(/^\d+$/, t('$.message.invalid_postal_code')),
			state: string().required(' '),
		}).required(' '),
	});

	const state = reactive<DeliveryDocument | any>(store.delivery);

	watch(
		state,
		useDebounceFn(async (value) => {
			if (store.delivery) {
				store.delivery.total_price = store.deliveries[store.delivery.type]?.price || 0;
				try {
					await formEl.value.validate();
					store.delivery.valid = true;
				} catch (error) {
					store.delivery.valid = false;
				}
			}
		}, 400)
	);
</script>
<template>
	<UForm
		ref="formEl"
		:schema="schema"
		:state="state"
		class="w-full border rounded-lg shadow-md my-4 dark:border dark:bg-gray-800 dark:border-gray-700"
	>
		<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
			<UFormGroup name="type">
				<h3 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
					{{ $t(store.fields.delivery.label) }}
				</h3>
				<div class="pt-2">
					<URadio
						v-for="option of store.deliveryOptions"
						:key="option.value"
						v-model="state.type"
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
									<Icon
										v-if="option?.avatar?.startsWith('mdi:')"
										:name="option.avatar"
										size="30"
										class="w-20"
									/>
									<NuxtImg
										v-else
										:src="option?.avatar"
										:alt="$t(option?.label)"
										loading="lazy"
										format="webp"
										width="80"
										class="w-20"
									/>
									<span>
										{{ $t(option?.label) }}
									</span>
									<UTooltip v-if="option?.help" :text="$t('$.cashdesk.delivery.brno_free')">
										<Icon name="mdi:question-mark-circle" size="20" />
									</UTooltip>
								</div>
								<span v-if="option.price! > 0">
									{{
										useToNumber(option?.price?.toFixed(2) || 0).value.toLocaleString(locale)
									}}&nbsp;{{ $t('$.czk') }}
								</span>
								<span v-else>
									{{ $t('$.cashdesk.delivery.free') }}
								</span>
							</div>
						</template>
					</URadio>
				</div>
			</UFormGroup>
		</div>
	</UForm>
</template>
