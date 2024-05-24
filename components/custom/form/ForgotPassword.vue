<script setup lang="ts">
	import { object, string, type InferType } from 'yup';
	import type { FormSubmitEvent } from '#ui/types';

	const { t } = useI18n();
	const toast = useToast();
	const schema = object({
		email: string().email(t('$.message.invalid_email')).required(' '),
	});

	type Schema = InferType<typeof schema>;

	const state = reactive({
		email: undefined,
	});

	const loading = ref();

	async function onSubmit(event: FormSubmitEvent<Schema>) {
		loading.value = true;
		try {
			await useAuthStore().resetPassword(event.data);
			// reset formulare
			state.email = undefined;
			toast.add({ title: t('$.forgot_password.success_msg'), color: 'green', icon: 'i-heroicons-check' });
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
		<div class="p-6 space-y-4">
			<h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
				{{ $t('$.forgot_password.title') }}
			</h1>
			<p class="font-light text-gray-500 dark:text-gray-400">{{ $t('$.forgot_password.description') }}</p>
			<UForm :schema="schema" :state="state" class="space-y-4 md:space-y-6" @submit="onSubmit">
				<UFormGroup :label="$t('$.form.email')" name="email" required>
					<UInput v-model="state.email" type="email" placeholder="name@company.com" required size="lg" />
				</UFormGroup>
				<UButton type="submit" size="lg" block :loading="loading" class="dark:text-white">
					{{ $t('$.btn.submit') }}
				</UButton>
			</UForm>
		</div>
	</div>
</template>
