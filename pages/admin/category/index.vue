<script setup lang="ts">
	import type { CategoryModel } from '@/server/models/category.schema';

	definePageMeta({
		layout: 'admin',
		syscode: 'admin_category',
		title: '$.dashboard.title',
	});

	const { t } = useI18n();
	const localePath = useLocalePath();
	const { routes } = useMenuItems();
	const { fieldOptions } = useCategories();

	useHead({
		title: `${t('$.base.title')} | ${t('$.dashboard.title')}`,
		meta: [
			{ name: 'description', content: t('$.base.description') },
			{ name: 'keywords', content: t('$.base.description') },
		],
	});

	const columns = fieldOptions.map((field) => ({ ...field, ...{ sortable: true } }));

	const { data: categories } = await useAsyncData(async (): Promise<CategoryModel[] | undefined> => {
		try {
			return await $fetch(`/api/category`);
		} catch (error: any) {
			console.error(error);
		}
	});

	const selected = ref([]);
</script>

<template>
	<div class="max-w-screen-xl mx-auto px-5 w-full">
		<div id="dashboard" class="py-10">
			<h1
				class="text-center text-primary-600 text-4xl lg:text-5xl font-bold tracking-tight dark:text-primary-400 pb-8"
			>
				{{ $t('$.admin.category.title') }}
			</h1>

			<div class="flex justify-end">
				<UButton
					icon="i-heroicons-trash"
					class="text-red-600 dark:text-red-600"
					:ui="{ rounded: 'rounded-full' }"
					variant="ghost"
					:aria-label="$t('$.aria.delete_selected')"
					:disabled="!selected.length"
				/>
				<UButton
					:to="localePath(routes.admin_category_create?.path)"
					icon="i-heroicons-plus-circle"
					class="text-orange-600 dark:text-orange-600"
					:ui="{ rounded: 'rounded-full' }"
					variant="ghost"
					:aria-label="$t('$.aria.delete_selected')"
				/>
			</div>
			<UTable v-model="selected" :columns="columns" :rows="categories">
				<template #name-data="{ row }">
					<ULink :to="routes.admin_category_update?.path?.replace(':_id()', row._id)">
						{{ row.name }}
					</ULink>
				</template>
			</UTable>
		</div>
	</div>
</template>
