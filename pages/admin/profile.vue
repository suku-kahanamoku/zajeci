<script setup lang="ts">
import { CLONE } from "@suku-kahanamoku/common-module/utils";
import type { IFormConfig } from "@suku-kahanamoku/form-module/types";

import pConfig from "@/assets/configs/profile.json";
import type { IItem } from "@suku-kahanamoku/common-module/types";

definePageMeta({
  layout: "admin",
  syscode: "admin_profile",
  title: "$.profile.title",
});

const { t } = useLang();
const { routes, route } = useMenuItems();
const { updateConfig } = useUrlResolver();
const { user, fetch } = useUserSession();
const { onSubmit } = useFormNavigable();
const title = computed(() =>
  t((route.meta.label || route.meta.title) as string)
);
const loading = ref(false);
const item = ref({
  ...user.value,
  password: undefined,
  tempPassword: undefined,
});

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
      const result = CLONE(pConfig);
      updateConfig(route, result);
      return result as IFormConfig;
    } catch (error: any) {
      return {} as IFormConfig;
    }
  },
  { watch: [() => route.query] }
);

async function onUpdate(body: Record<string, any>) {
  if (config.value?.patchUrl) {
    loading.value = true;

    const result = await onSubmit(config?.value!, body, item.value!);
    if (result?.data) {
      await fetch();
      item.value = result.data;
    }

    loading.value = false;
  }
}
</script>

<template>
  <div v-if="config" :id="config.syscode" class="w-full max-w-7xl mx-auto px-5">
    <UPageHeader
      :title="title"
      :ui="{ title: 'mx-auto text-primary-600 dark:text-white' }"
      class="border-none"
    />

    <CmpForm
      :fields="config.fields"
      :item="(item as IItem)"
      :loading="loading"
      :ui="{
        body: 'grid md:grid-cols-2 gap-4',
      }"
      :key="(item?.updatedAt as any)"
      @submit="onUpdate"
    />
  </div>
</template>
