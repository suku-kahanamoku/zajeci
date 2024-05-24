<script setup lang="ts">
	import { object, string, type InferType } from 'yup';
	import type { FormSubmitEvent } from '#ui/types';
	import type { PaymentDocument } from '@/server/types/order.type';

	const { t } = useI18n();
	const toast = useToast();
	const { payment, payments, paymentOptions, fields } = useCashdeskStore();

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

	const state = reactive<PaymentDocument | any>(payment);

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
			<UFormGroup :label="$t(fields.payment.label)" name="type">
				<USelectMenu
					v-model="state.type"
					:options="paymentOptions"
					value-attribute="value"
					option-attribute="label"
					size="lg"
				>
					<template #label>
						{{ $t(payments[state.type as any]?.label) }}
					</template>

					<template #option="{ option }">
						{{ $t(option.label) }}
					</template>
				</USelectMenu>
			</UFormGroup>
		</div>
	</UForm>
</template>
