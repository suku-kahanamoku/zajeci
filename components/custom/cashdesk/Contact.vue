<script setup lang="ts">
	import { object, string, type InferType } from 'yup';
	import type { FormSubmitEvent } from '#ui/types';

	const { t } = useI18n();
	const toast = useToast();
	const { user, fields } = useAuthStore();

	const schema = object({
		email: string().email(t('$.message.invalid_email')).required(' '),
		given_name: string().required(' '),
		family_name: string().required(' '),
	});

	type Schema = InferType<typeof schema>;

	const state = reactive(
		user || {
			email: undefined,
			given_name: '',
			family_name: '',
		}
	);
	console.log(user, state);

	const loading = ref();
</script>
<template>
	<div class="w-full border rounded-lg shadow-md max-w-md my-4 dark:border dark:bg-gray-800 dark:border-gray-700">
		<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
			<UForm :schema="schema" :state="state" class="space-y-4 md:space-y-6">
				<UFormGroup :label="$t(fields.email.label)" name="email" required>
					<UInput
						v-model="state.email"
						type="email"
						:placeholder="fields.email.placeholder"
						required
						size="lg"
					/>
				</UFormGroup>

				<div class="flex justify-between items-center gap-x-2">
					<UFormGroup :label="$t(fields.given_name.label)" name="given_name">
						<UInput
							v-model="state.given_name"
							:placeholder="$t(fields.given_name.placeholder as string)"
							size="lg"
						/>
					</UFormGroup>
					<UFormGroup :label="$t(fields.family_name.label)" name="family_name">
						<UInput
							v-model="state.family_name"
							:placeholder="$t(fields.family_name.placeholder as string)"
							size="lg"
						/>
					</UFormGroup>
				</div>
			</UForm>
		</div>
	</div>
</template>
