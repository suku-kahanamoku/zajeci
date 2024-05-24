<script setup lang="ts">
	import { object, string, type InferType } from 'yup';
	import type { FormSubmitEvent } from '#ui/types';

	const { t } = useI18n();
	const toast = useToast();
	const { fields } = useAuthStore();

	const schema = object({
		email: string().email(t('$.message.invalid_email')).required(' '),
		message: string().required(' '),
	});

	type Schema = InferType<typeof schema>;

	const state = reactive({
		email: undefined,
		message: undefined,
	});

	const loading = ref();

	async function onSubmit(event: FormSubmitEvent<Schema>) {
		loading.value = true;
		try {
			await $fetch('/api/send-email', { method: 'POST', body: event.data });
			// reset formulare
			state.email = undefined;
			state.message = undefined;
			toast.add({ title: t('$.contact.success_msg'), color: 'green', icon: 'i-heroicons-check' });
		} catch (error) {
			toast.add({ title: t('$.contact.error_msg'), color: 'red', icon: 'i-heroicons-exclamation-circle' });
		}
		loading.value = false;
	}
</script>
<template>
	<UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
		<UFormGroup :label="$t(fields.email.label)" name="email" required>
			<UInput
				v-model="state.email"
				type="email"
				:placeholder="fields.email.placeholder"
				size="lg"
				required
				icon="i-heroicons-envelope"
			/>
		</UFormGroup>
		<UFormGroup :label="$t('$.form.msg')" name="message" required>
			<UTextarea
				v-model="state.message"
				:placeholder="$t('$.placeholder.leave_comment')"
				required
				size="lg"
				icon="i-heroicons-chat-bubble-left-ellipsis"
				:rows="6"
			/>
		</UFormGroup>
		<div class="flex flex-row-reverse">
			<UButton type="submit" class="dark:text-white" size="lg" :loading="loading">
				{{ $t('$.btn.submit') }}
			</UButton>
		</div>
	</UForm>
</template>
