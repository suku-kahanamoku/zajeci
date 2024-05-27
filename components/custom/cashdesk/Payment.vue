<script setup lang="ts">
	import { object, string, type InferType } from 'yup';
	import type { FormSubmitEvent } from '#ui/types';
	import type { PaymentDocument } from '@/server/types/order.type';

	const { t } = useI18n();
	const toast = useToast();
	const store = useCashdeskStore();

	const schema = object({
		type: string().required(' '),
		credit_card: object({
			card_number: string().required(' '),
			expiration_date: string().required(' '),
			cvv: string().required(' '),
			cardholder_name: string().required(' '),
		}).required(' '),
	});

	type Schema = InferType<typeof schema>;

	const state = reactive<PaymentDocument | any>(store.payment);

	async function onSubmit(event: FormSubmitEvent<Schema>) {
		console.log(event.data);
	}
</script>
<template>
	<UForm
		:schema="schema"
		:state="state"
		class="w-full border rounded-lg shadow-md max-w-xl my-4 dark:border dark:bg-gray-800 dark:border-gray-700"
		@submit="onSubmit"
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
						v-model="state.type"
						:label="$t(option?.label)"
						:value="option.value"
						:ui="{ wrapper: 'py-1', base: 'cursor-pointer', label: 'cursor-pointer' }"
					/>
				</div>
			</UFormGroup>
		</div>
	</UForm>
</template>
