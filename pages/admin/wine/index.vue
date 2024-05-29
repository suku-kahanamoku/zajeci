<script setup lang="ts">
	import type { WineDocument } from '@/server/types/wine.type';

	definePageMeta({
		layout: 'admin',
		syscode: 'admin_wine',
		title: '$.admin.wine.title',
		middleware: () => {
			const auth = useAuthStore();

			if (!auth.isAdmin) {
				return navigateTo('/403');
			}
		},
	});

	const { t } = useI18n();
	const localePath = useLocalePath();
	const { kinds, colors, categories, fieldOptions } = useWines();
	const { routes } = useMenuItems();
	const toast = useToast();
	const selected = ref([]);
	const isOpen = ref(false);
	const deleted = ref();

	useHead({
		title: `${t('$.base.title')} | ${t('$.dashboard.title')}`,
		meta: [
			{ name: 'description', content: t('$.base.description') },
			{ name: 'keywords', content: t('$.base.description') },
		],
	});

	const columns = fieldOptions.map((field) => ({ ...field, ...{ sortable: true } }));

	const {
		data: wines,
		refresh,
		pending,
	} = await useAsyncData(async (): Promise<WineDocument[] | undefined> => {
		try {
			return (await $fetch(`/api/wine`)) as unknown as WineDocument[];
		} catch (error: any) {
			console.error(error);
		}
	});

	async function onDelete(value: boolean) {
		if (value) {
			try {
				await $fetch(`/api/admin/wine/${deleted.value._id}`, {
					method: 'DELETE',
				});
				toast.add({ title: t('$.form.delete_success_msg'), color: 'green', icon: 'i-heroicons-check' });
			} catch (error: any) {
				toast.add({ title: error.data.message, color: 'red', icon: 'i-heroicons-exclamation-circle' });
			}
			deleted.value = null;
			isOpen.value = false;
			await refresh();
		}
	}
</script>

<template>
	<div class="max-w-screen-xl mx-auto px-5 w-full">
		<div id="dashboard" class="py-10">
			<h1
				class="text-center text-primary-600 text-4xl lg:text-5xl font-bold tracking-tight dark:text-primary-400"
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
					:loading="pending"
				/>
				<UButton
					:to="localePath(routes.admin_wine_create?.path)"
					icon="i-heroicons-plus-circle"
					class="text-orange-600 dark:text-orange-600"
					:ui="{ rounded: 'rounded-full' }"
					variant="ghost"
					:aria-label="$t('$.aria.delete_selected')"
					:loading="pending"
				/>
			</div>
			<UTable v-model="selected" :columns="columns" :rows="wines">
				<template #name-data="{ row }">
					<div class="flex items-center gap-1">
						<UButton
							icon="i-heroicons-trash"
							color="red"
							:ui="{ rounded: 'rounded-full' }"
							variant="ghost"
							:aria-label="$t('$.aria.delete')"
							@click="
								deleted = row;
								isOpen = true;
							"
							:loading="pending"
						/>
						<ULink :to="routes.admin_wine_update?.path?.replace(':_id()', row._id)">
							{{ row.name }}
						</ULink>
					</div>
				</template>
				<template #kind-data="{ row }"> {{ kinds[row.kind]?.label }} </template>
				<template #color-data="{ row }"> {{ colors[row.color]?.label }} </template>
				<template #categories-data="{ row }">
					{{ row.categories?.map((category: string) => categories[category]?.label)?.join(',&nbsp;') }}
				</template>
			</UTable>
		</div>

		<UiModalConfirm v-model="isOpen" @confirm="onDelete">
			{{ $t('$.message.delete_question', { name: deleted?.name }) }}
		</UiModalConfirm>
	</div>
</template>
