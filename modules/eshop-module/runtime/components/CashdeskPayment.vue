<script setup lang="ts">
import { useUrlResolver, useAsyncData, useMenuItems } from "#imports";

import { CLONE } from "@/modules/common-module/runtime/utils/modify-object.functions";
import type { IFormField } from "@/modules/form-module/runtime/types/field.interface";

import pConfig from "../assets/configs/payment.json";

const { updateConfig } = useUrlResolver();
const { route } = useMenuItems();

/**
 * Load config
 */
const { data: config } = await useAsyncData(
  async () => {
    try {
      const result = CLONE(pConfig);
      updateConfig(route, result);
      return result as typeof pConfig;
    } catch (error: any) {
      return {} as typeof pConfig;
    }
  },
  { watch: [() => route.query] }
);
</script>
<template>
  <CmpForm
    v-if="config"
    :fields="(config.fields as IFormField[])"
    variant="subtle"
    :actions="{ disabled: true }"
    :ui="{
      body: 'grid md:grid-cols-2 gap-4',
    }"
    class="w-full"
  >
    <template #header>
      <h3
        class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
      >
        {{ $tt(config.title) }}
      </h3>
    </template>
  </CmpForm>
</template>
