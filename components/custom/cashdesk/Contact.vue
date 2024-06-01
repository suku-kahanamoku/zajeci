<script setup lang="ts">
	import { object, string } from 'yup';
	import { useDebounceFn } from '@vueuse/core';

	const { t } = useI18n();
	const auth = useAuthStore();
	const cashdesk = useCashdeskStore();
	const formEl = ref();

	const schema = object({
		email: string().email(t('$.message.invalid_email')).required(' '),
		phone: string(),
		givenName: string().required(' '),
		surname: string().required(' '),
		address: object({
			main: object({
				name: string(),
				street: string().required(' '),
				city: string().required(' '),
				zip: string().required(' ').matches(/^\d+$/, t('$.message.invalid_zip')),
				state: string().required(' '),
			}).required(' '),
		}).required(' '),
	});

	onMounted(checkValidation);

	watch(cashdesk.user, useDebounceFn(checkValidation, 400));

	async function checkValidation() {
		if (cashdesk.user) {
			try {
				await formEl.value.validate();
				cashdesk.user.valid = true;
			} catch (error) {
				cashdesk.user.valid = false;
			}
		}
	}
</script>
<template>
	<div class="w-full border rounded-lg shadow-md max-w-xl my-4 dark:border dark:bg-gray-800 dark:border-gray-700">
		<UForm ref="formEl" :schema="schema" :state="cashdesk.user">
			<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
				<h3 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
					{{ $t('$.cashdesk.billing_address') }}
				</h3>

				<div class="flex flex-col sm:flex-row justify-between items-center gap-x-2 space-y-4 sm:space-y-0">
					<UFormGroup :label="$t(auth.fields.email.label)" name="email" required class="w-full">
						<UInput
							v-model="cashdesk.user.email"
							type="email"
							:placeholder="auth.fields.email.placeholder"
							:autocomplete="auth.fields.email.autocomplete"
							size="lg"
						/>
					</UFormGroup>
					<UFormGroup :label="$t(auth.fields.phone.label)" name="phone" class="w-full">
						<UInput
							v-model="cashdesk.user.phone"
							type="phone"
							:placeholder="auth.fields.phone.placeholder"
							:autocomplete="auth.fields.phone.autocomplete"
							size="lg"
						/>
					</UFormGroup>
				</div>

				<div class="flex flex-col sm:flex-row justify-between items-center gap-x-2 space-y-4 sm:space-y-0">
					<UFormGroup :label="$t(auth.fields.givenName.label)" name="givenName" required class="w-full">
						<UInput
							v-model="cashdesk.user.givenName"
							:placeholder="$t(auth.fields.givenName.placeholder as string)"
							:autocomplete="auth.fields.givenName.autocomplete"
							size="lg"
							@change="
								!cashdesk.delivery.valid
									? (cashdesk.delivery.address!.name = `${cashdesk.user.givenName} ${cashdesk.user.surname}`)
									: undefined
							"
						/>
					</UFormGroup>
					<UFormGroup :label="$t(auth.fields.surname.label)" name="surname" required class="w-full">
						<UInput
							v-model="cashdesk.user.surname"
							:placeholder="$t(auth.fields.surname.placeholder as string)"
							:autocomplete="auth.fields.surname.autocomplete"
							size="lg"
							@change="
								!cashdesk.delivery.valid
									? (cashdesk.delivery.address!.name = `${cashdesk.user.givenName} ${cashdesk.user.surname}`)
									: undefined
							"
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
							v-model="cashdesk.user.address!.main!.street"
							:placeholder="$t(auth.fields.street.placeholder as string)"
							:autocomplete="auth.fields.street.autocomplete"
							size="lg"
							@change="
								!cashdesk.delivery.valid ? (cashdesk.delivery.address!.street = $event) : undefined
							"
						/>
					</UFormGroup>
					<UFormGroup :label="$t(auth.fields.city.label)" name="address.main.city" required class="w-full">
						<UInput
							v-model="cashdesk.user.address!.main!.city"
							:placeholder="$t(auth.fields.city.placeholder as string)"
							:autocomplete="auth.fields.city.autocomplete"
							size="lg"
							@change="!cashdesk.delivery.valid ? (cashdesk.delivery.address!.city = $event) : undefined"
						/>
					</UFormGroup>
				</div>

				<div class="flex flex-col sm:flex-row justify-between items-center gap-x-2 space-y-4 sm:space-y-0">
					<UFormGroup :label="$t(auth.fields.zip.label)" name="address.main.zip" required class="w-full">
						<UInput
							v-model="cashdesk.user.address!.main!.zip"
							:placeholder="$t(auth.fields.zip.placeholder as string)"
							:autocomplete="auth.fields.zip.autocomplete"
							size="lg"
							@change="!cashdesk.delivery.valid ? (cashdesk.delivery.address!.zip = $event) : undefined"
						/>
					</UFormGroup>
					<UFormGroup :label="$t(auth.fields.state.label)" name="address.main.state" required class="w-full">
						<USelectMenu
							v-model="cashdesk.user.address!.main!.state"
							:options="auth.stateOptions?.map((item) => ({ ...item, ...{ label: $t(item.label) } }))"
							value-attribute="value"
							option-attribute="label"
							:placeholder="$t(auth.fields.state.placeholder as string)"
							:autocomplete="auth.fields.state.autocomplete"
							size="lg"
							@change="!cashdesk.delivery.valid ? (cashdesk.delivery.address!.state = $event) : undefined"
						/>
					</UFormGroup>
				</div>
			</div>
		</UForm>
	</div>
</template>
