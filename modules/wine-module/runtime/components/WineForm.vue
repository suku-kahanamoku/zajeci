<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";

import type { IWine } from "~/modules/wine-module/runtime/types/wine.interface";
import type { Schema } from "yup";

const emits = defineEmits<{
  (event: "submit", val: FormSubmitEvent<any>): void;
}>();

defineProps<{
  schema: Schema;
  item: IWine;
  loading?: boolean;
}>();

const localePath = useLocalePath();
const { kindOptions, colorOptions, fields, categoryOptions } = useWines();
const { routes } = useMenuItems();
</script>

<template>
  <UForm :schema="schema" :state="item" @submit="emits('submit', $event)">
    <UFormField :label="fields.name.label" name="name" class="mb-6">
      <UTextarea
        v-model="item.name"
        :placeholder="fields.name.placeholder"
        size="lg"
        :rows="2"
      />
    </UFormField>

    <div class="grid md:grid-cols-2 gap-x-4 gap-y-6">
      <UFormField :label="fields.kind.label" name="kind" required>
        <USelectMenu
          v-model="item.kind"
          :options="kindOptions"
          value-attribute="value"
          option-attribute="label"
          :placeholder="fields.kind.placeholder"
          size="lg"
          required
        />
      </UFormField>

      <UFormField :label="fields.quality.label" name="quality" required>
        <UInput
          v-model="item.quality"
          :placeholder="fields.quality.placeholder"
          size="lg"
          required
        />
      </UFormField>

      <UFormField :label="fields.color.label" name="color" required>
        <USelectMenu
          v-model="item.color"
          :options="colorOptions"
          value-attribute="value"
          option-attribute="label"
          :placeholder="fields.color.placeholder"
          size="lg"
          required
        />
      </UFormField>

      <UFormField :label="fields.variety.label" name="variety" required>
        <UInput
          v-model="item.variety"
          :placeholder="fields.variety.placeholder"
          size="lg"
          required
        />
      </UFormField>

      <UFormField :label="fields.volume.label" name="volume" required>
        <UInput
          v-model="item.volume"
          type="number"
          :step="0.05"
          size="lg"
          required
        />
      </UFormField>

      <UFormField :label="fields.year.label" name="year" required>
        <UInput v-model="item.year" type="number" size="lg" required />
      </UFormField>

      <UFormField :label="fields.price.label" name="price" required>
        <UInput v-model="item.price" type="number" size="lg" required />
      </UFormField>

      <UFormField :label="fields.quantity.label" name="quantity" required>
        <UInput v-model="item.quantity" type="number" size="lg" required />
      </UFormField>

      <UFormField :label="fields.categories.label" name="categories">
        <USelectMenu
          v-model="item.categories"
          :options="categoryOptions"
          value-attribute="value"
          option-attribute="label"
          :multiple="true"
          :placeholder="fields.categories.placeholder"
          size="lg"
        />
      </UFormField>
    </div>

    <UFormField
      class="mt-6"
      :label="fields.description.label"
      name="description"
      required
    >
      <UTextarea v-model="item.description" size="lg" required :rows="10" />
    </UFormField>

    <div class="flex justify-between pt-8">
      <UButton
        :to="localePath(routes.admin_wine?.path)"
        icon="i-heroicons-arrow-left"
        variant="outline"
        size="lg"
      >
        {{ $tt("$.btn.back") }}
      </UButton>
      <UButton
        type="submit"
        size="lg"
        :loading="loading"
        class="dark:text-white"
      >
        {{ $tt("$.btn.submit") }}
      </UButton>
    </div>
  </UForm>
</template>
