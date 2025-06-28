<script setup lang="ts">
import wConfig from "../../../assets/configs/admin-wine-list.json";
import type { IWine } from "../../../types";

definePageMeta({
  layout: "admin",
  syscode: "admin_wine",
  title: "$.admin.wine.title",
});

const { t } = useLang();
const localePath = useLocalePath();
const { routes, route } = useMenuItems();
const title = computed(() => t(route.meta.title as string));
const { config, wines, loading, selected, isOpen, onDelete } =
  useWineAdmin(wConfig);

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
  <div
    v-if="config"
    :id="config.syscode"
    class="max-w-screen-xl mx-auto px-5 w-full"
  >
    <div class="flex flex-col gap-8 py-10">
      <h1
        class="text-center text-primary-600 text-4xl lg:text-5xl font-bold tracking-tight dark:text-primary-400"
      >
        {{ title }}
      </h1>

      <div class="flex justify-end">
        <UButton
          icon="i-heroicons-trash"
          color="error"
          variant="ghost"
          :aria-label="$tt('$.aria.delete_selected')"
          :disabled="!selected.length"
          :loading="loading"
          @click="isOpen = true"
        />
        <UButton
          :to="localePath(routes.admin_wine_create?.path)"
          icon="i-heroicons-plus-circle"
          color="secondary"
          variant="ghost"
          :aria-label="$tt('$.aria.delete_selected')"
          :loading="loading"
        />
      </div>

      <CmpTable
        ref="tableCmp"
        v-model:selected="selected"
        :config="config"
        :data="(wines?.data as IWine[])"
        :loading="loading"
        @delete="isOpen = true"
      />
    </div>

    <CmpConfirmDialog
      v-model="isOpen"
      :title="$tt('$.btn.delete')"
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
          ? $tt("$.message.delete_question_multi", {
              length: selected?.length,
            })
          : $tt("$.message.delete_question", { name: selected?.[0]?.name })
      }}
    </CmpConfirmDialog>
  </div>
</template>
