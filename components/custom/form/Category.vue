<script setup lang="ts">
	import type { FormSubmitEvent } from '#ui/types';

	import type { CategoryModel } from '@/server/models/category.schema';

	const emits = defineEmits<{
		(event: 'submit', val: FormSubmitEvent<any>): void;
	}>();

	defineProps<{
		schema: any;
		item: CategoryModel;
		loading?: boolean;
	}>();

	const { fields } = useCategories();
</script>

<template>
	<UForm :schema="schema" :state="item" @submit="emits('submit', $event)">
		<div class="grid md:grid-cols-2 gap-x-4 gap-y-6">
			<UFormGroup :label="fields.name.label" name="name">
				<UInput v-model="item.name" :placeholder="fields.name.placeholder" size="lg" />
			</UFormGroup>
		</div>

		<UFormGroup class="mt-6" :label="fields.description.label" name="description">
			<UTextarea v-model="item.description" size="lg" />
		</UFormGroup>

		<div class="pt-8">
			<UButton type="submit" size="lg" block :loading="loading" class="dark:text-white">
				{{ $t('$.form.submit') }}
			</UButton>
		</div>
	</UForm>
</template>
