<script setup lang="ts">
	import { object, string, boolean, type InferType, number, array } from 'yup';
	import type { FormSubmitEvent } from '#ui/types';

	import type { WineModel } from '@/server/models/wine.schema';

	definePageMeta({
		layout: 'admin',
		syscode: 'admin_wine_update',
		title: '$.admin.wine.update.title',
	});

	const { t } = useI18n();
	const route = useRoute();
	const toast = useToast();
	const today = new Date();
	const { getChangedParams } = useWines();

	useHead({
		title: `${t('$.base.title')} | ${t('$.forgot_password.title')}`,
		meta: [
			{ name: 'description', content: t('$.base.description') },
			{ name: 'keywords', content: t('$.base.description') },
		],
	});

	const schema = object({
		name: string().required(),
		description: string().required(),
		kind: string().required(),
		quality: string().required(),
		color: string().required(),
		variety: string().required(),
		volume: number().required().positive(),
		year: number().required().positive().integer().min(2000).max(today.getFullYear()),
		price: number().required().positive().integer(),
		/* categories: array().required().min(1), */
		categories: array(),
		published: boolean(),
	});

	const { data: wine, pending } = await useAsyncData(async () => {
		try {
			return await $fetch(`/api/wine/${route.params._id}`);
		} catch (error: any) {
			console.error(error);
		}
	});

	const state: Ref<WineModel> = ref(CLONE(wine.value));

	async function onSubmit(event: FormSubmitEvent<InferType<typeof schema>>) {
		pending.value = true;
		try {
			const changedParams = getChangedParams(wine.value as any, event.data);
			const result = await $fetch(`/api/admin/wine/${route.params._id}`, {
				method: 'PATCH',
				body: changedParams,
			});
			state.value = CLONE(result);
			toast.add({ title: t('$.form.patch_success_msg'), color: 'green', icon: 'i-heroicons-check' });
		} catch (error: any) {
			toast.add({ title: error.data.message, color: 'red', icon: 'i-heroicons-exclamation-circle' });
		}
		setTimeout(() => (pending.value = false), 400);
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
						{{ $t('$.admin.wine.update.title', { name: state?.name }) }}
					</h1>

					<AdminFormWine v-if="state" :schema="schema" :item="state" :loading="pending" @submit="onSubmit" />
				</div>
			</div>
		</div>
	</div>
</template>
