<script setup lang="ts">
	import { object, string, boolean, ref as yupRef, type InferType } from 'yup';
	import type { FormSubmitEvent } from '#ui/types';

	const { routes } = useMenuItems();
	const { t } = useI18n();
	const toast = useToast();
	const localePath = useLocalePath();

	const schema = object({
		email: string().email(t('$.message.invalid_email')).required(' '),
		password: string()
			.required(' ')
			.min(8, t('$.message.password_min', { count: 8 })),
		confirm_password: string()
			.required(' ')
			.oneOf([yupRef('password')], t('$.message.password_not_match')),
		terms: boolean().required(' '),
	});

	type Schema = InferType<typeof schema>;

	const state = reactive({
		email: undefined,
		password: undefined,
		confirm_password: undefined,
		terms: undefined,
	});

	const loading = ref();

	async function onSubmit(event: FormSubmitEvent<Schema>) {
		loading.value = true;
		try {
			await useAuthStore().signup(event.data);
		} catch (error: any) {
			toast.add({ title: error.data.message, color: 'red', icon: 'i-heroicons-exclamation-circle' });
		}
		loading.value = false;
	}
</script>
<template>
	<div
		class="w-full border rounded-lg shadow-md dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
	>
		<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
			<h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
				{{ $t('$.signup.title') }}
			</h1>
			<UForm :schema="schema" :state="state" class="space-y-4 md:space-y-6" @submit="onSubmit">
				<UFormGroup :label="$t('$.form.email')" name="email">
					<UInput v-model="state.email" type="email" placeholder="name@company.com" required size="lg" />
				</UFormGroup>
				<UFormGroup :label="$t('$.form.password')" name="password">
					<UInput
						v-model="state.password"
						type="password"
						placeholder="name@company.com"
						required
						size="lg"
						autocomplete="new-password"
					/>
				</UFormGroup>
				<UFormGroup :label="$t('$.signup.confirm_password')" name="confirm_password">
					<UInput
						v-model="state.confirm_password"
						type="password"
						placeholder="name@company.com"
						required
						size="lg"
					/>
				</UFormGroup>
				<UFormGroup name="terms" :error="state.terms === false ? true : undefined" class="flex items-center">
					<template #default="{ error }">
						<UCheckbox
							v-model="state.terms"
							:ui="{
								ring:
									error &&
									'ring ring-inset ring-red-500 dark:ring-red-400 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400',
							}"
						>
							<template #label>
								<span>
									{{ $t('$.signup.accept_condition') }}
								</span>
								&nbsp;
								<UButton
									:to="localePath(routes.terms_conditions?.path)"
									class="text-primary-500"
									variant="link"
									size="sm"
									:padded="false"
									>{{ $t(routes.terms_conditions?.meta?.title) }}</UButton
								>
							</template>
						</UCheckbox>
					</template>
				</UFormGroup>
				<UButton type="submit" size="lg" block :loading="loading">
					{{ $t('$.signup.title') }}
				</UButton>
				<p class="text-sm font-light text-gray-500 dark:text-gray-400">
					{{ $t('$.signup.has_account') }}
					<UButton
						:to="localePath(routes.login?.path)"
						class="font-medium text-primary-500"
						variant="link"
						size="sm"
						:padded="false"
						>{{ $t(routes.login?.meta?.title) }}</UButton
					>
				</p>
			</UForm>
		</div>
	</div>
</template>
