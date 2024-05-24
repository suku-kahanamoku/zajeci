<script setup lang="ts">
	import { object, string, type InferType } from 'yup';
	import type { FormSubmitEvent } from '#ui/types';
	import type { UserDocument } from '@/server/types/user.type';

	const { t } = useI18n();
	const toast = useToast();
	const { delivery, fields } = useCashdeskStore();

	const schema = object({
		email: string().email(t('$.message.invalid_email')).required(' '),
		phone: string(),
		given_name: string().required(' '),
		family_name: string().required(' '),
		address: object({
			main: object({
				street: string().required(' '),
				city: string().required(' '),
				postal_code: string().required(' ').matches(/^\d+$/, t('$.message.invalid_postal_code')),
				state: string().required(' '),
			}).required(' '),
		}).required(' '),
	});

	type Schema = InferType<typeof schema>;

	const state = reactive<UserDocument | any>(delivery);

	async function onSubmit(event: FormSubmitEvent<Schema>) {
		console.log(event.data);
	}
</script>
<template>
	<UForm :schema="schema" :state="state" @submit="onSubmit">
		<div class="w-full border rounded-lg shadow-md max-w-xl my-4 dark:border dark:bg-gray-800 dark:border-gray-700">
			<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
				<h3 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
					{{ $t('$.cashdesk.billing_address') }}
				</h3>

				<div class="flex justify-between items-center gap-x-2">
					<UFormGroup :label="$t(fields.email.label)" name="email" required>
						<UInput
							v-model="state.email"
							type="email"
							:placeholder="fields.email.placeholder"
							:autocomplete="fields.email.autocomplete"
							required
							size="lg"
						/>
					</UFormGroup>
					<UFormGroup :label="$t(fields.phone.label)" name="phone">
						<UInput
							v-model="state.phone"
							type="phone"
							:placeholder="fields.phone.placeholder"
							:autocomplete="fields.phone.autocomplete"
							size="lg"
						/>
					</UFormGroup>
				</div>

				<div class="flex justify-between items-center gap-x-2">
					<UFormGroup :label="$t(fields.given_name.label)" name="given_name" required>
						<UInput
							v-model="state.given_name"
							:placeholder="$t(fields.given_name.placeholder as string)"
							:autocomplete="fields.given_name.autocomplete"
							size="lg"
							required
						/>
					</UFormGroup>
					<UFormGroup :label="$t(fields.family_name.label)" name="family_name" required>
						<UInput
							v-model="state.family_name"
							:placeholder="$t(fields.family_name.placeholder as string)"
							:autocomplete="fields.family_name.autocomplete"
							size="lg"
							required
						/>
					</UFormGroup>
				</div>
			</div>
		</div>

		<!-- <UButton type="submit" size="lg" block class="dark:text-white">
			{{ $t('$.btn.submit') }}
		</UButton> -->
	</UForm>
</template>
