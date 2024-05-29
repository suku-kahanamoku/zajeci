<script setup lang="ts">
	import { object, string } from 'yup';
	import { useDebounceFn } from '@vueuse/core';

	const { t } = useI18n();
	const auth = useAuthStore();
	const store = useCashdeskStore();
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

	watch(
		store.user,
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
		<UForm ref="formEl" :schema="schema" :state="store.user">
			<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
				<h3 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
					{{ $t('$.cashdesk.billing_address') }}
				</h3>

				<div class="flex flex-col sm:flex-row justify-between items-center gap-x-2 space-y-4 sm:space-y-0">
					<UFormGroup :label="$t(auth.fields.email.label)" name="email" required class="w-full">
						<UInput
							v-model="store.user.email"
							type="email"
							:placeholder="auth.fields.email.placeholder"
							:autocomplete="auth.fields.email.autocomplete"
							size="lg"
						/>
					</UFormGroup>
					<UFormGroup :label="$t(auth.fields.phone.label)" name="phone" class="w-full">
						<UInput
							v-model="store.user.phone"
							type="phone"
							:placeholder="auth.fields.phone.placeholder"
							:autocomplete="auth.fields.phone.autocomplete"
							size="lg"
						/>
					</UFormGroup>
				</div>

				<div class="flex flex-col sm:flex-row justify-between items-center gap-x-2 space-y-4 sm:space-y-0">
					<UFormGroup :label="$t(auth.fields.given_name.label)" name="given_name" required class="w-full">
						<UInput
							v-model="store.user.given_name"
							:placeholder="$t(auth.fields.given_name.placeholder as string)"
							:autocomplete="auth.fields.given_name.autocomplete"
							size="lg"
						/>
					</UFormGroup>
					<UFormGroup :label="$t(auth.fields.family_name.label)" name="family_name" required class="w-full">
						<UInput
							v-model="store.user.family_name"
							:placeholder="$t(auth.fields.family_name.placeholder as string)"
							:autocomplete="auth.fields.family_name.autocomplete"
							size="lg"
						/>
					</UFormGroup>
				</div>

				<div class="flex flex-col sm:flex-row justify-between items-center gap-x-2 space-y-4 sm:space-y-0">
					<UFormGroup
						:label="$t(auth.fields.street.label)"
						name="address.main.street"
						required
						class="w-full"
					>
						<UInput
							v-model="store.user.address!.main!.street"
							:placeholder="$t(auth.fields.street.placeholder as string)"
							:autocomplete="auth.fields.street.autocomplete"
							size="lg"
						/>
					</UFormGroup>
					<UFormGroup :label="$t(auth.fields.city.label)" name="address.main.city" required class="w-full">
						<UInput
							v-model="store.user.address!.main!.city"
							:placeholder="$t(auth.fields.city.placeholder as string)"
							:autocomplete="auth.fields.city.autocomplete"
							size="lg"
						/>
					</UFormGroup>
				</div>

				<div class="flex flex-col sm:flex-row justify-between items-center gap-x-2 space-y-4 sm:space-y-0">
					<UFormGroup
						:label="$t(auth.fields.postal_code.label)"
						name="address.main.postal_code"
						required
						class="w-full"
					>
						<UInput
							v-model="store.user.address!.main!.postal_code"
							:placeholder="$t(auth.fields.postal_code.placeholder as string)"
							:autocomplete="auth.fields.postal_code.autocomplete"
							size="lg"
						/>
					</UFormGroup>
					<UFormGroup :label="$t(auth.fields.state.label)" name="address.main.state" required class="w-full">
						<USelectMenu
							v-model="store.user.address!.main!.state"
							:options="auth.stateOptions?.map((item) => ({ ...item, ...{ label: $t(item.label) } }))"
							value-attribute="value"
							option-attribute="label"
							:placeholder="$t(auth.fields.state.placeholder as string)"
							:autocomplete="auth.fields.state.autocomplete"
							size="lg"
						/>
					</UFormGroup>
				</div>
			</div>
		</UForm>
	</div>
</template>
