<script setup lang="ts">
	import { object, string, boolean, type InferType, number } from 'yup';
	import type { FormSubmitEvent } from '#ui/types';

	import type { CategoryModel } from '@/server/models/category.schema';

	definePageMeta({
		layout: 'admin',
		syscode: 'admin_category_create',
		title: '$.admin.category.create.title',
	});

	const { t } = useI18n();
	const toast = useToast();
	const today = new Date();
	const loading = ref();
	const { defaultItem } = useCategories();

	useHead({
		title: t('$.admin.category.create.title'),
		meta: [
			{ name: 'description', content: t('$.base.description') },
			{ name: 'keywords', content: t('$.base.description') },
		],
	});

	const schema = object({
		name: string().required(),
		description: string().required(),
	});

	const state: Ref<CategoryModel> = ref(CLONE(defaultItem));

	async function onSubmit(event: FormSubmitEvent<InferType<typeof schema>>) {
		console;
		loading.value = true;
		try {
			await $fetch('/api/admin/category', { method: 'POST', body: event.data });
			state.value = CLONE(defaultItem);
			toast.add({ title: t('$.form.post_success_msg'), color: 'green', icon: 'i-heroicons-check' });
		} catch (error: any) {
			toast.add({ title: error.data.message, color: 'red', icon: 'i-heroicons-exclamation-circle' });
		}
		loading.value = false;
	}
</script>

<template>
	<div class="flex w-full">
		<div class="flex items-center justify-center mx-auto w-full sm:py-12">
			<div
				class="w-full border rounded-lg shadow-md dark:border sm:max-w-lg md:max-w-xl dark:bg-gray-800 dark:border-gray-700"
			>
				<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
					<h1
						class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
					>
						{{ $t('$.admin.category.create.title') }}
					</h1>

					<CustomFormCategory :schema="schema" :item="state" :loading="loading" @submit="onSubmit" />
				</div>
			</div>
		</div>
	</div>
</template>
