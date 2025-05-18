<script setup lang="ts">
import {
  CLONE,
  ITERATE,
} from "@/modules/common-module/runtime/utils/modify-object.functions";
import type { IFormField } from "@/modules/form-module/runtime/types/field.interface";

import cConfig from "../../assets/configs/contact.json";

const route = useRoute();
const { updateConfig } = useUrlResolver();
const { display } = useToastify();
const loading = ref();

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
  { watch: [() => route.query] }
);

async function onSubmit(body: Record<string, any>) {
  loading.value = true;
  try {
    await useApi("/api/emails/contact", { method: "POST", body });
    // reset formulare
    ITERATE(body, (v, k) => (body[k] = undefined));
    display({ type: "success", message: "$.home.contact.success_msg" });
  } catch (error: any) {
    display({ type: "error", message: error.data.message });
  }
  loading.value = false;
}
</script>

<template>
  <div id="contact" class="py-10 lg:py-16">
    <div class="text-center pb-8 lg:pb-10">
      <h2
        class="text-primary-600 text-4xl lg:text-5xl font-bold tracking-tight dark:text-primary-400"
      >
        {{ $tt("$.contact.title") }}
      </h2>
    </div>

    <div class="grid md:grid-cols-2 gap-10 mx-auto max-w-screen-lg py-4">
      <div class="from-left">
        <h3
          class="font-medium text-xl lg:text-2xl text-gray-700 dark:text-primary-400"
        >
          {{ $tt("$.contact.subtitle") }}
        </h3>
        <p class="lg:text-lg text-gray-600 dark:text-gray-400 mt-3">
          {{ $tt("$.contact.appointment") }}
        </p>
        <div class="mt-5">
          <div class="flex items-center mt-3 space-x-3 text-gray-600">
            <Icon class="text-secondary-400" name="uil:envelope" size="26" />
            <a class="dark:text-white" href="mailto:vyborne@vinozezajeci.cz">
              vyborne@vinozezajeci.cz
            </a>
          </div>
          <div class="flex items-center mt-3 space-x-3 text-gray-600">
            <Icon class="text-secondary-400" name="uil:phone" size="26" />
            <a class="dark:text-white" href="tel:+420770199999">
              +420 770 199 999
            </a>
          </div>
          <div class="flex items-center mt-3 space-x-3 text-gray-600">
            <Icon
              class="text-secondary-400"
              name="mdi:phone-classic"
              size="26"
            />
            <a class="dark:text-white" href="tel:+420 778 711 111">
              +420 778 711 111
            </a>
          </div>
          <div class="flex items-start mt-3 space-x-3 text-gray-600">
            <Icon class="text-secondary-400" name="uil:map-marker" size="26" />
            <span class="dark:text-white">
              Školní 156, 69105 Zaječí<br />
              IČ 19737491, DIČ CZ7951084053
            </span>
          </div>
        </div>
      </div>
      <div class="from-right">
        <CmpForm
          :fields="(config?.fields as IFormField[])"
          variant="soft"
          @submit="onSubmit"
        >
          <template #actions>
            <UButton data-testid="contact-form-submit" type="submit">{{
              $tt("$.form.submit")
            }}</UButton>
          </template>
        </CmpForm>
      </div>
    </div>
  </div>
</template>
