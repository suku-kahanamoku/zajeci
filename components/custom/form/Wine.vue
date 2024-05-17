<script setup lang="ts">
	import type { FormSubmitEvent } from '#ui/types';

	import type { WineModel } from '@/server/models/wine.schema';

	const emits = defineEmits<{
		(event: 'submit', val: FormSubmitEvent<any>): void;
	}>();

	defineProps<{
		schema: any;
		item: WineModel;
		loading?: boolean;
	}>();

	const localePath = useLocalePath();
	const { kindOptions, colorOptions, fields, categoryOptions } = useWines();
	const { routes } = useMenuItems();
</script>

<template>
	<UForm :schema="schema" :state="item" @submit="emits('submit', $event)">
		<div class="grid md:grid-cols-2 gap-x-4 gap-y-6">
			<UFormGroup :label="fields.name.label" name="name">
				<UInput v-model="item.name" :placeholder="fields.name.placeholder" size="lg" />
			</UFormGroup>

			<UFormGroup :label="fields.kind.label" name="kind">
				<USelectMenu
					v-model="item.kind"
					:options="kindOptions"
					value-attribute="value"
					option-attribute="label"
					:placeholder="fields.kind.placeholder"
					size="lg"
				/>
			</UFormGroup>

			<UFormGroup :label="fields.quality.label" name="quality">
				<UInput v-model="item.quality" :placeholder="fields.quality.placeholder" size="lg" />
			</UFormGroup>

			<UFormGroup :label="fields.color.label" name="color">
				<USelectMenu
					v-model="item.color"
					:options="colorOptions"
					value-attribute="value"
					option-attribute="label"
					:placeholder="fields.color.placeholder"
					size="lg"
				/>
			</UFormGroup>

			<UFormGroup :label="fields.variety.label" name="variety">
				<UInput v-model="item.variety" :placeholder="fields.variety.placeholder" size="lg" />
			</UFormGroup>

			<UFormGroup :label="fields.volume.label" name="volume">
				<UInput v-model="item.volume" type="number" :step="0.05" size="lg" />
			</UFormGroup>

			<UFormGroup :label="fields.year.label" name="year">
				<UInput v-model="item.year" type="number" size="lg" />
			</UFormGroup>

			<UFormGroup :label="fields.price.label" name="price">
				<UInput v-model="item.price" type="number" size="lg" />
			</UFormGroup>

			<UFormGroup :label="fields.categories.label" name="categories">
				<USelectMenu
					v-model="item.categories"
					:options="categoryOptions"
					value-attribute="value"
					option-attribute="label"
					:multiple="true"
					:placeholder="fields.categories.placeholder"
					size="lg"
				/>
			</UFormGroup>
		</div>

		<UFormGroup class="mt-6" :label="fields.description.label" name="description">
			<UTextarea v-model="item.description" size="lg" />
		</UFormGroup>

		<div class="flex justify-between pt-8">
			<UButton
				:to="localePath(routes.admin_wine?.path)"
				icon="i-heroicons-arrow-left"
				color="gray"
				variant="outline"
				size="lg"
			>
				{{ $t('$.btn.back') }}
			</UButton>
			<UButton type="submit" size="lg" :loading="loading" class="dark:text-white">
				{{ $t('$.btn.submit') }}
			</UButton>
		</div>
	</UForm>
</template>
