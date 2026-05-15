<script setup lang="ts">
import sConfig from "../../../assets/configs/admin-shipping-list.json";
import type { IEnumItem } from "../../../types/enum.types";

definePageMeta({
  layout: "admin",
  syscode: "admin_shipping",
  title: "$.admin.shipping.title",
});

const { t } = useLang();
const localePath = useLocalePath();
const { routes, route } = useMenuItems();
const title = computed(() => t(route.meta.title as string));
const {
  config,
  tastes: shippings,
  meta,
  loading,
  selected,
  isOpen,
  onDelete,
  handleSort,
  handlePage,
  handleFilter,
} = useTasteAdmin(sConfig);

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
        :to="localePath(routes.admin_shipping_create?.path!)"
        icon="i-heroicons-plus-circle"
        color="secondary"
        variant="outline"
        :aria-label="$tt('$.aria.add')"
        :loading="loading"
      />
    </div>

    <CmpTable
      ref="tableCmp"
      v-model:selected="selected"
      :config="config"
      :data="shippings?.data as IEnumItem[]"
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
