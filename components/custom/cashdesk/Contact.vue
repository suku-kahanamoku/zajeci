<script setup lang="ts">
	import { object, string } from 'yup';
	import type { UserDocument } from '@/server/types/user.type';
	import { useDebounceFn } from '@vueuse/core';

	const { t } = useI18n();
	const { fields } = useAuthStore();
	const store = useCashdeskStore();
	const auth = useAuthStore();
	const formEl = ref();

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

	const state = reactive<UserDocument | any>(store.user);

	watch(
		state,
		useDebounceFn(async (value) => {
			if (store.user) {
				try {
					await formEl.value.validate();
					store.user.valid = true;
				} catch (error) {
					store.user.valid = false;
				}
			}
		}, 400)
	);
</script>
<template>
	<div class="w-full border rounded-lg shadow-md max-w-xl my-4 dark:border dark:bg-gray-800 dark:border-gray-700">
		<UForm ref="formEl" :schema="schema" :state="state">
			<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
				<h3 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
					{{ $t('$.cashdesk.billing_address') }}
				</h3>

				<div class="flex flex-col sm:flex-row justify-between items-center gap-x-2 space-y-4 sm:space-y-0">
					<UFormGroup :label="$t(fields.email.label)" name="email" required class="w-full">
						<UInput
							v-model="state.email"
							type="email"
							:placeholder="fields.email.placeholder"
							:autocomplete="fields.email.autocomplete"
							size="lg"
						/>
					</UFormGroup>
					<UFormGroup :label="$t(fields.phone.label)" name="phone" class="w-full">
						<UInput
							v-model="state.phone"
							type="phone"
							:placeholder="fields.phone.placeholder"
							:autocomplete="fields.phone.autocomplete"
							size="lg"
						/>
					</UFormGroup>
				</div>

				<div class="flex flex-col sm:flex-row justify-between items-center gap-x-2 space-y-4 sm:space-y-0">
					<UFormGroup :label="$t(fields.given_name.label)" name="given_name" required class="w-full">
						<UInput
							v-model="state.given_name"
							:placeholder="$t(fields.given_name.placeholder as string)"
							:autocomplete="fields.given_name.autocomplete"
							size="lg"
						/>
					</UFormGroup>
					<UFormGroup :label="$t(fields.family_name.label)" name="family_name" required class="w-full">
						<UInput
							v-model="state.family_name"
							:placeholder="$t(fields.family_name.placeholder as string)"
							:autocomplete="fields.family_name.autocomplete"
							size="lg"
						/>
					</UFormGroup>
				</div>

				<div class="flex flex-col sm:flex-row justify-between items-center gap-x-2 space-y-4 sm:space-y-0">
					<UFormGroup :label="$t(fields.street.label)" name="address.main.street" required class="w-full">
						<UInput
							v-model="state.address.main.street"
							:placeholder="$t(fields.street.placeholder as string)"
							:autocomplete="fields.street.autocomplete"
							size="lg"
						/>
					</UFormGroup>
					<UFormGroup :label="$t(fields.city.label)" name="address.main.city" required class="w-full">
						<UInput
							v-model="state.address.main.city"
							:placeholder="$t(fields.city.placeholder as string)"
							:autocomplete="fields.city.autocomplete"
							size="lg"
						/>
					</UFormGroup>
				</div>

				<div class="flex flex-col sm:flex-row justify-between items-center gap-x-2 space-y-4 sm:space-y-0">
					<UFormGroup
						:label="$t(fields.postal_code.label)"
						name="address.main.postal_code"
						required
						class="w-full"
					>
						<UInput
							v-model="state.address.main.postal_code"
							:placeholder="$t(fields.postal_code.placeholder as string)"
							:autocomplete="fields.postal_code.autocomplete"
							size="lg"
						/>
					</UFormGroup>
					<UFormGroup :label="$t(fields.state.label)" name="address.main.state" required class="w-full">
						<USelectMenu
							v-model="state.address.main.state"
							:options="auth.stateOptions?.map((item) => ({ ...item, ...{ label: $t(item.label) } }))"
							value-attribute="value"
							option-attribute="label"
							:placeholder="$t(fields.state.placeholder as string)"
							:autocomplete="fields.state.autocomplete"
							size="lg"
						/>
					</UFormGroup>
				</div>
			</div>
		</UForm>
	</div>
</template>
