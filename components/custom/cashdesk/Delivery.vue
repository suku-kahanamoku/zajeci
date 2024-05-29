<script setup lang="ts">
	import { object, string } from 'yup';
	import { useToNumber } from '@vueuse/core';
	import { useDebounceFn } from '@vueuse/core';
	import { DeliveryServices } from '@/server/types/order.type';

	const { t, locale } = useI18n();
	const auth = useAuthStore();
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

	watch(
		store.delivery,
		useDebounceFn(async (value) => {
			if (store.delivery) {
				store.delivery.total_price = store.deliveries[store.delivery.type]?.price || 0;
				try {
					await formEl.value.validate();
					store.delivery.valid = true;
				} catch (error) {
					store.delivery.valid = false;
				}
				console.log(store.delivery);
			}
		}, 400)
	);
</script>
<template>
	<UForm
		ref="formEl"
		:schema="schema"
		:state="store.delivery"
		class="w-full border rounded-lg shadow-md my-4 dark:border dark:bg-gray-800 dark:border-gray-700"
	>
		<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
			<h3 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
				{{ $t(store.fields.delivery.label) }}
			</h3>
			<div class="pt-2">
				<URadio
					v-for="option of store.deliveryOptions"
					:key="option.value"
					v-model="store.delivery.type"
					:value="option.value"
					:disabled="option?.disabled"
					:ui="{
						wrapper: 'py-1',
						base: `${option.disabled ? 'cursor-not-allowed' : 'cursor-pointer'} mt-4`,
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
								{{ useToNumber(option?.price?.toFixed(2) || 0).value.toLocaleString(locale) }}&nbsp;{{
									$t('$.czk')
								}}
							</span>
							<span v-else>
								{{ $t('$.cashdesk.delivery.free') }}
							</span>
						</div>

						<!-- pokud je vybrana hodnota free (rozvoz po brne), tak zobrazi formular s dodaci adresou -->
						<div
							v-if="
								option.value === DeliveryServices.free && store.delivery.type === DeliveryServices.free
							"
							class="space-y-4 my-4"
						>
							<div
								class="flex flex-col sm:flex-row justify-between items-center gap-x-2 space-y-4 sm:space-y-0"
							>
								<UFormGroup
									:label="$t(auth.fields.street.label)"
									name="address.main.street"
									required
									class="w-full"
								>
									<UInput
										v-model="store.delivery.address!.street"
										:placeholder="$t(auth.fields.street.placeholder as string)"
										:autocomplete="auth.fields.street.autocomplete"
										size="lg"
									/>
								</UFormGroup>
								<UFormGroup
									:label="$t(auth.fields.city.label)"
									name="address.main.city"
									required
									class="w-full"
								>
									<UInput
										v-model="store.delivery.address!.city"
										:placeholder="$t(auth.fields.city.placeholder as string)"
										:autocomplete="auth.fields.city.autocomplete"
										size="lg"
									/>
								</UFormGroup>
							</div>

							<div
								class="flex flex-col sm:flex-row justify-between items-center gap-x-2 space-y-4 sm:space-y-0"
							>
								<UFormGroup
									:label="$t(auth.fields.postal_code.label)"
									name="address.main.postal_code"
									required
									class="w-full"
								>
									<UInput
										v-model="store.delivery.address!.postal_code"
										:placeholder="$t(auth.fields.postal_code.placeholder as string)"
										:autocomplete="auth.fields.postal_code.autocomplete"
										size="lg"
									/>
								</UFormGroup>
								<UFormGroup
									:label="$t(auth.fields.state.label)"
									name="address.main.state"
									required
									class="w-full"
								>
									<USelectMenu
										v-model="store.delivery.address!.state"
										:options="
											auth.stateOptions?.map((item) => ({
												...item,
												...{ label: $t(item.label) },
											}))
										"
										value-attribute="value"
										option-attribute="label"
										:placeholder="$t(auth.fields.state.placeholder as string)"
										:autocomplete="auth.fields.state.autocomplete"
										size="lg"
									/>
								</UFormGroup>
							</div>
						</div>
					</template>
				</URadio>
			</div>
		</div>
	</UForm>
</template>
