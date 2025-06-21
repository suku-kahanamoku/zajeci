<script setup lang="ts">
import type {
  IWine,
  IWineResponse,
} from "@/modules/wine-module/runtime/types/wine.interface";
import { CLONE } from "@/modules/common-module/runtime/utils/modify-object.functions";
import type { IFormConfig } from "@/modules/form-module/runtime/types";

import wConfig from "../../../assets/configs/admin-wine-update.json";

definePageMeta({
  layout: "admin",
  syscode: "admin_wine_detail",
  title: "$.admin.wine_detail.title",
});

const { t } = useLang();
const localePath = useLocalePath();
const { routes, route } = useMenuItems();
const { updateConfig } = useUrlResolver();
const { onSubmit } = useFormNavigable();
const toast = useToast();
const title = computed(
  () => t((route.params.id || route.meta.title) as string).split("--$")[0]
);

useHead({
  title,
  meta: [
    { name: "description", content: t("$.base.description") },
    { name: "keywords", content: t("$.base.description") },
  ],
});

/**
 * Load config
 */
const { data: config } = await useAsyncData(
  async () => {
    try {
      const result = CLONE(wConfig);
      updateConfig(route, result);
      return result as IFormConfig;
    } catch (error: any) {
      return {} as IFormConfig;
    }
  },
  { watch: [() => route.query] }
);

/**
 * Load data
 */
const { data: wine, pending } = await useAsyncData(
  async (): Promise<IWineResponse | undefined> => {
    if (config.value?.restUrl) {
      try {
        let url = useCompleteUrl(config.value?.restUrl, {
          config: config.value,
          route,
        });
        return await useApi(url);
      } catch (error: any) {
        console.error(error);
      }
    }
  },
  { watch: [route] }
);

async function submit(body: Record<string, any>) {
  pending.value = true;
  const result = await onSubmit(config?.value!, body, wine.value?.data);
  if (result?.data) {
    document
      .querySelectorAll(".field-warning")
      .forEach((el) => el.classList.remove("field-warning"));
    navigateTo(routes.admin_wine.path);
  }
  pending.value = false;
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

      <CmpForm
        v-if="config?.fields"
        :fields="config.fields"
        :item="wine?.data"
        :loading="pending"
        :ui="{
          body: 'grid md:grid-cols-2 gap-4',
        }"
        :key="wine?.data?.updatedAt"
        @submit="submit"
      />
    </div>
  </div>
</template>
