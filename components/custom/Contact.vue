<script setup lang="ts">
import { useUrlResolver } from "#imports";

import { CLONE, ITERATE } from "@suku-kahanamoku/common-module/utils";
import type { IFormField } from "@suku-kahanamoku/form-module/types";

import cConfig from "../../assets/configs/contact.json";

const route = useRoute();
const { updateConfig } = useUrlResolver();
const { display } = useToastify();
const loading = ref();
const formKey = ref(0);

/**
 * Load config
 */
const { data: config } = await useAsyncData(
  async () => {
    try {
      const result = CLONE(cConfig);
      updateConfig(route, result);
      return result as typeof cConfig;
    } catch (error: any) {
      return {} as typeof cConfig;
    }
  },
  { watch: [() => route.query] },
);

/**
 * Load contact info
 */
const { data: contactInfo } = await useAsyncData("contact-info", async () => {
  try {
    if (config.value?.restUrl) {
      const r = await useApi(config.value.restUrl);
      return r.data?.[0]?.data ?? null;
    }
    return null;
  } catch {
    return null;
  }
});

async function onSubmit(body: Record<string, any>) {
  loading.value = true;
  try {
    await useApi("/api/email/contact", { method: "POST", body });
    formKey.value++;
    display({ type: "success", message: "$.contact.success_msg" });
  } catch (error: any) {
    display({
      type: "error",
      message: error?.data?.message || error?.message,
    });
  }
  loading.value = false;
}
</script>

<template>
  <div id="contact">
    <div class="text-center pt-20 pb-8">
      <p
        class="text-xs font-semibold tracking-widest uppercase text-bittersweet mb-3"
      >
        {{ $tt("$.contact.eyebrow") || "Napište nám" }}
      </p>
      <h2
        class="font-serif text-4xl md:text-5xl font-bold text-primary-600 dark:text-primary-300 mb-6"
      >
        {{ $tt("$.contact.title") }}
      </h2>
      <div class="section-divider text-bittersweet w-full mt-6 mb-2">
        <UIcon name="uil:envelope" size="16" />
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-10 mx-auto py-4">
      <div class="from-left">
        <!-- subtitle removed for cleaner design -->
        <p class="lg:text-lg text-gray-600 dark:text-gray-400 mt-3">
          {{ $tt("$.contact.appointment") }}
        </p>
        <div class="mt-5">
          <div class="flex items-center mt-3 space-x-3 text-gray-600">
            <UIcon class="text-primary-500" name="uil:envelope" size="26" />
            <a class="dark:text-white" :href="`mailto:${contactInfo?.email}`">
              {{ contactInfo?.email }}
            </a>
          </div>
          <div class="flex items-center mt-3 space-x-3 text-gray-600">
            <UIcon class="text-primary-500" name="uil:phone" size="26" />
            <a
              class="dark:text-white"
              :href="`tel:${contactInfo?.phone1?.replace(/\s/g, '')}`"
            >
              {{ contactInfo?.phone1 }}
            </a>
          </div>
          <div class="flex items-center mt-3 space-x-3 text-gray-600">
            <UIcon
              class="text-primary-500"
              name="mdi:phone-classic"
              size="26"
            />
            <a
              class="dark:text-white"
              :href="`tel:${contactInfo?.phone2?.replace(/\s/g, '')}`"
            >
              {{ contactInfo?.phone2 }}
            </a>
          </div>
          <div class="flex items-start mt-3 space-x-3 text-gray-600">
            <UIcon class="text-primary-500" name="uil:map-marker" size="26" />
            <span class="dark:text-white text-blue">
              {{ contactInfo?.street }}, {{ contactInfo?.zip }}
              {{ contactInfo?.city }}<br />
              IČ {{ contactInfo?.ic }}, DIČ {{ contactInfo?.dic }}
            </span>
          </div>
        </div>
      </div>
      <div class="from-right">
        <CmpForm
          :key="formKey"
          :fields="config?.fields as IFormField[]"
          variant="subtle"
          :actions="{
            no: {
              disabled: true,
            },
          }"
          :loading="loading"
          @submit="onSubmit"
        >
        </CmpForm>
      </div>
    </div>
  </div>
</template>
