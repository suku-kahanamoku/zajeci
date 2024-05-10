<script setup lang="ts">
	import { object, string, type InferType } from 'yup';
	import type { FormSubmitEvent } from '#ui/types';

	const { routes } = useMenuItems();
	const { t } = useI18n();
	const toast = useToast();
	const localePath = useLocalePath();

	const schema = object({
		email: string().email(t('$.message.invalid_email')).required(' '),
		password: string().required(' '),
	});

	type Schema = InferType<typeof schema>;

	const state = reactive({
		email: undefined,
		password: undefined,
	});

	const loading = ref();

	async function onSubmit(event: FormSubmitEvent<Schema>) {
		loading.value = true;
		try {
			await useAuthStore().login(event.data);
		} catch (error: any) {
			toast.add({ title: error.data.message, color: 'red', icon: 'i-heroicons-exclamation-circle' });
		}
		loading.value = false;
	}
</script>
<template>
	<div class="w-full border rounded-lg shadow-md dark:border max-w-md my-4 dark:bg-gray-800 dark:border-gray-700">
		<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
			<h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
				{{ $t('$.login.title') }}
			</h1>

			<div class="flex justify-between items-center w-full gap-4">
				<UButton
					variant="outline"
					color="gray"
					size="lg"
					class="flex-1"
					@click="useAuthStore().loginByGoogle()"
				>
					<div class="flex items-center justify-center gap-2 mx-auto">
						<Icon name="logos:google-icon" size="20" />
						Google
					</div>
				</UButton>
				<UButton
					variant="outline"
					color="gray"
					size="lg"
					class="flex-1"
					@click="useAuthStore().loginByLinkedin()"
				>
					<div class="flex items-center justify-center gap-2 mx-auto">
						<Icon name="logos:linkedin-icon" size="20" />
						LinkedIn
					</div>
				</UButton>
				<!-- <UButton
					variant="outline"
					color="gray"
					size="lg"
					class="flex-1"
					@click="useAuthStore().loginByFacebook()"
				>
					<div class="flex items-center justify-center gap-2 mx-auto">
						<Icon name="logos:facebook" size="21" />
						Facebook
					</div>
				</UButton> -->
			</div>

			<UDivider :label="$t('$.login.or')" />

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
					/>
				</UFormGroup>
				<div class="flex items-center justify-between">
					<UCheckbox name="remember" :label="$t('$.login.remember')" />
					<UButton
						:to="localePath(routes.forgot_password?.path)"
						class="text-primary-500"
						variant="link"
						size="sm"
						:padded="false"
						>{{ $t(routes.forgot_password?.meta?.title) }}</UButton
					>
				</div>
				<UButton type="submit" size="lg" block :loading="loading">
					{{ $t('$.login.signin') }}
				</UButton>
				<p class="text-sm font-light text-gray-500 dark:text-gray-400">
					{{ $t('$.login.no_account') }}
					<UButton
						:to="localePath(routes.signup?.path)"
						class="font-medium text-primary-500"
						variant="link"
						size="sm"
						:padded="false"
						>{{ $t(routes.signup?.meta?.title) }}</UButton
					>
				</p>
			</UForm>
		</div>
	</div>
</template>
