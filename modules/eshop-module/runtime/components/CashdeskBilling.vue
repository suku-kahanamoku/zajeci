<script setup lang="ts">
import { useUrlResolver, useAsyncData, useMenuItems } from "#imports";
import { useDebounceFn } from "@vueuse/core";
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
const { user, setUser, setBillingValid } = useCashdesk();
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
  { watch: [() => route.query] },
);

function _onChange(body: Record<string, any>) {
  const data = CLONE(body);
  CONVERT_DOT_TO_OBJECT(data);
  // Zachovat shipping adresu z aktualniho user state
  data.address = {
    ...data.address,
    shipping: user.value.address?.shipping,
  };
  setUser(data);
  setBillingValid(!formCmp.value?.form?.getErrors().length);
}

// Debounced change handler (300ms default)
const onFormChange = useDebounceFn(_onChange, 300);

const isValid = ref(false);

async function _initialValidate(form: any) {
  if (form) {
    await form.validate({ silent: true });
    isValid.value = !form.getErrors().length;
    setBillingValid(isValid.value);
  }
}

// Spustit validaci hned jak je dostupný formulář
watch(
  () => formCmp.value?.form,
  async (form: any) => {
    await _initialValidate(form);
  },
  { once: true },
);

// Re-validovat po načtení dat z localStorage (user.email se změní z "" na skutečnou hodnotu)
watch(
  () => user.value.email,
  async () => {
    await nextTick();
    if (formCmp.value?.form) {
      await _initialValidate(formCmp.value.form);
    }
  },
);
</script>
<template>
  <CmpForm
    v-if="config"
    ref="formCmp"
    :fields="config.fields"
    :item="user as IItem"
    variant="subtle"
    :actions="{ disabled: true }"
    :ui="{
      root: '',
      body: 'grid md:grid-cols-2 gap-4',
    }"
    @change="onFormChange"
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
