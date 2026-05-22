<script setup lang="ts">
import vConfig from "../../../assets/configs/admin-vat-rate-list.json";
import type { IEnumItem } from "../../../types/enum.types";

definePageMeta({
  layout: "admin",
  syscode: "admin_vat_rate",
  title: "$.admin.vat_rate.title",
});

const { t } = useLang();
const localePath = useLocalePath();
const { routes, route } = useMenuItems();
const title = computed(() => t(route.meta.title as string));
const {
  config,
  tastes: vatRates,
  meta,
  loading,
  selected,
  isOpen,
  onDelete,
  handleSort,
  handlePage,
  handleFilter,
} = useTasteAdmin(vConfig, "admin_vat_rate");

useHead({
  title,
  meta: [
    { name: "description", content: t("$.base.description") },
    { name: "keywords", content: t("$.base.description") },
  ],
});
const tableCmp = useTemplateRef("tableCmp");

async function onDeleteHandler(event: boolean) {
  await onDelete(event);
  tableCmp.value?.tableEl?.tableApi.resetRowSelection();
}
</script>

<template>
  <div v-if="config" :id="config.syscode" class="w-full max-w-7xl mx-auto px-5">
    <UPageHeader
      :title="title"
      :ui="{ title: 'mx-auto text-primary-600 dark:text-white' }"
      class="border-none"
    />

    <div
      class="mb-4 p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800"
    >
      <p class="text-sm text-primary-700 dark:text-primary-300">
        {{ $tt("$.admin.vat_rate.info") }}
      </p>
    </div>

    <div class="flex justify-end gap-2">
      <UButton
        icon="i-heroicons-trash"
        color="error"
        variant="outline"
        :aria-label="$tt('$.aria.delete_selected')"
        :disabled="!selected.length"
        :loading="loading"
        @click="isOpen = true"
      />
      <UButton
        icon="i-heroicons-plus"
        color="primary"
        :to="localePath((routes as any).admin_vat_rate_create?.path)"
        :aria-label="$tt('$.admin.vat_rate.create_vat_rate')"
      >
        {{ $tt("$.admin.vat_rate.create_vat_rate") }}
      </UButton>
    </div>

    <CmpTable
      ref="tableCmp"
      v-model:selected="selected"
      :config="config"
      :data="vatRates?.data as IEnumItem[]"
      :meta="meta"
      :loading="loading"
      @delete="isOpen = true"
      @sort="handleSort"
      @page="handlePage"
      @filter="handleFilter"
    />

    <CmpConfirmDialog
      v-model="isOpen"
      :title="$tt('$.btn.delete')"
      color="error"
      :btns="{ ok: { icon: 'i-heroicons-trash' } }"
      @confirm="onDeleteHandler"
    >
      {{
        selected?.length > 1
          ? $tt("$.message.delete_question_multi", { length: selected?.length })
          : $tt("$.message.delete_question", { name: selected?.[0]?.label })
      }}
    </CmpConfirmDialog>
  </div>
</template>
