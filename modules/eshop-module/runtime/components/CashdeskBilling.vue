<script setup lang="ts">
import { useUrlResolver, useAsyncData, useMenuItems } from "#imports";
import { useDebounceFn } from "@vueuse/core";
import defu from "defu";

import {
  CLONE,
  CONVERT_DOT_TO_OBJECT,
} from "@suku-kahanamoku/common-module/utils";
import type { IFormConfig } from "@suku-kahanamoku/form-module/types";
import type { IItem } from "@suku-kahanamoku/common-module/types";

import lConfig from "../assets/configs/billing.json";

const { t } = useLang();
const { route } = useMenuItems();
const { updateConfig } = useUrlResolver();
const { user, setUser, delivery, setDelivery } = useCashdesk();
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

function _onChange(body: Record<string, any>) {
  const data = CLONE(body);
  CONVERT_DOT_TO_OBJECT(data);
  data.valid = formCmp.value.form.getErrors().length ? false : true;
  setUser(data);
  const address = defu(delivery.value.address, {
    ...data.address?.main,
    name: `${data.givenName} ${data.surname}`,
  });
  setDelivery(delivery.value, address);
}

// Debounced change handler (300ms default)
const onChange = useDebounceFn(_onChange, 300);
</script>
<template>
  <CmpForm
    v-if="config"
    ref="formCmp"
    :fields="config.fields"
    :item="(user as IItem)"
    variant="subtle"
    :actions="{ disabled: true }"
    :ui="{
      root: '',
      body: 'grid md:grid-cols-2 gap-4',
    }"
    @change="onChange"
  >
    <template #header>
      <h3
        class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
      >
        {{ t(config.title!) }}
      </h3>
    </template>
  </CmpForm>
</template>
