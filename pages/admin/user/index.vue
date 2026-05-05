<script setup lang="ts">
import type { IAdminUser } from "@/types/user.types";
import uConfig from "@/assets/configs/admin-user-list.json";

definePageMeta({
  layout: "admin",
  syscode: "admin_user",
  title: "$.admin.user.title",
});

const { t } = useLang();
const localePath = useLocalePath();
const { routes, route } = useMenuItems();
const title = computed(() => t(route.meta.title as string));
const { config, users, loading, selected, isOpen, onDelete } =
  useUserAdmin(uConfig);

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
        :aria-label="t('$.aria.delete_selected')"
        :disabled="!selected.length"
        :loading="loading"
        @click="isOpen = true"
      />
    </div>

    <CmpTable
      ref="tableCmp"
      v-model:selected="selected"
      :config="config"
      :data="(users?.data as IAdminUser[])"
      :loading="loading"
      @delete="isOpen = true"
    />

    <CmpConfirmDialog
      v-model="isOpen"
      :title="t('$.btn.delete')"
      color="error"
      :btns="{
        ok: {
          icon: 'i-heroicons-trash',
        },
      }"
      @confirm="onDeleteHandler"
    >
      {{
        selected?.length > 1
          ? t("$.message.delete_question_multi", {
              length: selected?.length,
            })
          : t("$.message.delete_question", { name: selected?.[0]?.email })
      }}
    </CmpConfirmDialog>
  </div>
</template>
