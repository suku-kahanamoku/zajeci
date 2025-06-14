<script setup lang="ts">
import { useUrlResolver, useAsyncData, useMenuItems } from "#imports";

import {
  CLONE,
  CONVERT_DOT_TO_OBJECT,
} from "@/modules/common-module/runtime/utils/modify-object.functions";
import type { IFormConfig } from "@/modules/form-module/runtime/types/form.interface";
import type { IFormField } from "@/modules/form-module/runtime/types/field.interface";

import lConfig from "../assets/configs/billing.json";
import defu from "defu";

const { updateConfig } = useUrlResolver();
const { route } = useMenuItems();
const cashdesk = useCashdeskStore();
const formCmp = ref();

/**
 * Load config
 */
const { data: config } = await useAsyncData(
  async () => {
    try {
      const result = CLONE(lConfig);
      updateConfig(route, result);
      return result as IFormConfig;
    } catch (error: any) {
      return {} as IFormConfig;
    }
  },
  { watch: [() => route.query] }
);

function onChange(body: Record<string, any>) {
  if (config.value) {
    const tmpBody = CLONE(body);
    CONVERT_DOT_TO_OBJECT(tmpBody);
    cashdesk.setUser(defu(tmpBody.user, cashdesk.user));
  }
}
</script>
<template>
  <CmpForm
    v-if="config"
    ref="formCmp"
    :fields="(config.fields as IFormField[])"
    :item="(cashdesk as any)"
    variant="subtle"
    :actions="{ disabled: true }"
    :ui="{
      body: 'grid md:grid-cols-2 gap-4',
    }"
    class="w-full"
    @change="onChange"
  >
    <template #header>
      <h3
        class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
      >
        {{ $tt(config.title!) }}
      </h3>
    </template>
  </CmpForm>
</template>
