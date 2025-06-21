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

const { config, wines, pending, columns, selected, isOpen, onDelete } =
  useWineAdmin(wConfig);

useHead({
  title,
  meta: [
    { name: "description", content: t("$.base.description") },
    { name: "keywords", content: t("$.base.description") },
  ],
});
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
          class="text-error-600 dark:text-error-600"
          variant="ghost"
          :aria-label="$tt('$.aria.delete_selected')"
          :disabled="!selected.length"
          :loading="pending"
          @click="isOpen = true"
        />
        <UButton
          :to="localePath(routes.admin_wine_create?.path)"
          icon="i-heroicons-plus-circle"
          class="text-orange-600 dark:text-orange-600"
          variant="ghost"
          :aria-label="$tt('$.aria.delete_selected')"
          :loading="pending"
        />
      </div>

      <UTable
        v-if="wines?.data?.length"
        :data="(wines.data as IWine[])"
        :columns="columns"
        class="flex-1"
      >
        <template #name-cell="{ row }">
          <NuxtLink :to="row.original?.gen_data?.url">
            {{ row.original?.name }}
          </NuxtLink>
        </template>
      </UTable>
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
      @confirm="onDelete"
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
