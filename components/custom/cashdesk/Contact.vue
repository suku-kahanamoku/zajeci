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
</script>
<template>
	<div class="w-full border rounded-lg shadow-md dark:border max-w-md my-4 dark:bg-gray-800 dark:border-gray-700">
		<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
			<UForm :schema="schema" :state="state" class="space-y-4 md:space-y-6">
				<UFormGroup :label="$t('$.form.email')" name="email" required>
					<UInput v-model="state.email" type="email" placeholder="name@company.com" required size="lg" />
				</UFormGroup>
			</UForm>
		</div>
	</div>
</template>
