<script setup lang="ts">
import type {
  IWine,
  IWinesResponse,
} from "@/modules/wine-module/runtime/types/wine.interface";
import { CLONE } from "@/modules/common-module/runtime/utils/modify-object.functions";

import wConfig from "../../../assets/configs/admin-wine-list.json";
import type { TableColumn } from "@nuxt/ui";

definePageMeta({
  layout: "admin",
  syscode: "admin_wine",
  title: "$.admin.wine.title",
});

const { t } = useLang();
const localePath = useLocalePath();
const { routes, route } = useMenuItems();
const { updateConfig } = useUrlResolver();
const toast = useToast();
const title = computed(() => t(route.meta.title as string));

useHead({
  title,
  meta: [
    { name: "description", content: t("$.base.description") },
    { name: "keywords", content: t("$.base.description") },
  ],
});

const selected = ref<IWine[]>([]);
const isOpen = ref(false);
const columns: Ref<TableColumn<IWine>[]> = computed(
  () =>
    config.value?.fields?.map((f) => ({
      accessorKey: f.name,
      header: t(f.label),
    })) ?? []
);

/**
 * Load config
 */
const { data: config } = await useAsyncData(
  async () => {
    try {
      const result = CLONE(wConfig);
      updateConfig(route, result);
      return result as typeof wConfig;
    } catch (error: any) {
      return {} as typeof wConfig;
    }
  },
  { watch: [() => route.query] }
);

/**
 * Load data
 */
const {
  data: wines,
  pending,
  refresh,
} = await useAsyncData(
  async (): Promise<IWinesResponse | undefined> => {
    if (config.value?.restUrl) {
      try {
        let url = useCompleteUrl(config.value?.restUrl, {
          config: config.value,
          route,
        });
        url = useFactory(url, config.value.factory, route?.path);
        return await useApi(url);
      } catch (error: any) {
        console.error(error);
      }
    }
  },
  { watch: [route] }
);

async function onDelete(value: boolean) {
  if (value && config.value?.deleteUrl && selected.value?.length) {
    const method = "DELETE";
    try {
      let url = useUrl(config.value.deleteUrl, {
        config: config.value,
        route,
        item: selected.value,
      });
      await useApi(url);
      toast.add({
        title: t("$.form.delete_success_msg"),
        color: "success",
        icon: "i-heroicons-check",
      });
    } catch (error: any) {
      toast.add({
        title: error.data.message,
        color: "error",
        icon: "i-heroicons-exclamation-circle",
      });
    }
    selected.value = [];
    isOpen.value = false;
    await refresh();
  }
}
</script>

<template>
  <div class="max-w-screen-xl mx-auto px-5 w-full">
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

      <UTable :data="wines?.data" :columns="columns" class="flex-1">
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
