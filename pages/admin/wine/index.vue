<script setup lang="ts">
	import type { WineModel } from '@/server/models/wine.schema';

	definePageMeta({
		layout: 'admin',
		syscode: 'admin_wine',
		title: '$.dashboard.title',
	});

	const { t } = useI18n();
	const localePath = useLocalePath();
	const { kinds, colors, fieldOptions } = useWines();
	const { routes } = useMenuItems();

	useHead({
		title: `${t('$.base.title')} | ${t('$.dashboard.title')}`,
		meta: [
			{ name: 'description', content: t('$.base.description') },
			{ name: 'keywords', content: t('$.base.description') },
		],
	});

	const columns = fieldOptions.map((field) => ({ ...field, ...{ sortable: true } }));

	const { data: wines } = await useAsyncData(async (): Promise<WineModel[] | undefined> => {
		try {
			return await $fetch(`/api/wine`);
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
				{{ $t('$.admin.wine.title') }}
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
					:to="localePath(routes.admin_wine_create?.path)"
					icon="i-heroicons-plus-circle"
					class="text-orange-600 dark:text-orange-600"
					:ui="{ rounded: 'rounded-full' }"
					variant="ghost"
					:aria-label="$t('$.aria.delete_selected')"
				/>
			</div>
			<UTable v-model="selected" :columns="columns" :rows="wines">
				<template #name-data="{ row }">
					<ULink :to="routes.admin_wine_update?.path?.replace(':_id()', row._id)">
						{{ row.name }}
					</ULink>
				</template>
				<template #kind-data="{ row }"> {{ kinds[row.kind]?.label }} </template>
				<template #color-data="{ row }"> {{ colors[row.color]?.label }} </template>
			</UTable>
		</div>
	</div>
</template>
