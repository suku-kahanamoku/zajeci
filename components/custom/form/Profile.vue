<script setup lang="ts">
	import { object, string, boolean, type InferType } from 'yup';
	import type { FormSubmitEvent } from '#ui/types';

	import type { UserModel } from '@/server/models/user.schema';

	const { t } = useI18n();
	const toast = useToast();

	const schema = object({
		email: string().email(t('$.message.invalid_email')).required(' '),
		password: string().min(8, t('$.message.password_min', { count: 8 })),
		new_password: string().min(8, t('$.message.password_min', { count: 8 })),
		newsletter: boolean(),
	});

	type Schema = InferType<typeof schema>;

	const authStore = useAuthStore();

	const state: Ref<UserModel> = ref({
		_id: '',
		email: '',
		password: '',
		new_password: '',
		newsletter: true,
	});

	const loading = ref();

	onMounted(async () => {
		const data = (await $fetch(`/api/admin/user/${authStore.user?._id}`, { method: 'GET' })) as UserModel;
		if (data) {
			state.value = data;
		}
	});

	async function onSubmit(event: FormSubmitEvent<Schema>) {
		loading.value = true;
		try {
			await $fetch(`/api/admin/user/${authStore.user?._id}`, { method: 'PATCH', body: event.data });
			toast.add({ title: t('$.profile.success_msg'), color: 'green', icon: 'i-heroicons-check' });
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
				{{ $t('$.profile.title') }}
			</h1>
			<UForm :schema="schema" :state="state" class="space-y-4 md:space-y-6" @submit="onSubmit">
				<UFormGroup :label="$t('$.form.email')" name="email">
					<UInput
						v-model="state.email"
						type="email"
						placeholder="name@company.com"
						required
						size="lg"
						readonly
					/>
				</UFormGroup>
				<UFormGroup :label="$t('$.form.password')" name="password">
					<UInput v-model="state.password" type="password" placeholder="*******" size="lg" />
				</UFormGroup>
				<UFormGroup :label="$t('$.profile.change_password')" name="new_password">
					<UInput
						v-model="state.new_password"
						type="password"
						placeholder="*******"
						size="lg"
						autocomplete="new-password"
					/>
				</UFormGroup>
				<UCheckbox
					v-model="state.newsletter"
					name="newsletter"
					:label="$t('$.profile.newsletter')"
					:loading="loading"
				/>
				<UButton type="submit" size="lg" block class="dark:text-white">
					{{ $t('$.btn.submit') }}
				</UButton>
			</UForm>
		</div>
	</div>
</template>
