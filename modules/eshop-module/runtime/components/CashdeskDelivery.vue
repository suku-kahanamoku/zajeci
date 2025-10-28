<script setup lang="ts">
import { useUrlResolver, useAsyncData, useMenuItems } from "#imports";
import { useToNumber, useDebounceFn } from "@vueuse/core";

import { CLONE } from "@suku-kahanamoku/common-module/utils";
import type { IFormConfig } from "@suku-kahanamoku/form-module/types";

import dConfig from "../assets/configs/delivery.json";

const {
  i18n: { locale },
  t,
} = useLang();
const { route } = useMenuItems();
const { updateConfig } = useUrlResolver();
const { delivery, deliveryOptions, setDelivery } = useCashdesk();
const formCmp = ref();

/**
 * Load config
 */
const { data: config } = await useAsyncData(
  async () => {
    try {
      const result = CLONE(dConfig);
      updateConfig(route, result);
      return result as IFormConfig;
    } catch (error: any) {
      return {} as IFormConfig;
    }
  },
  { watch: [() => route.query] }
);

function _onChange(body: Record<string, any>) {
  setDelivery(delivery.value, body);
}

const onChange = useDebounceFn(_onChange, 300);

watch(
  delivery,
  () =>
    (delivery.value.valid = formCmp.value.form.getErrors().length
      ? false
      : true)
);
</script>
<template>
  <UCard v-if="config" variant="subtle" class="w-full">
    <template #header>
      <h3
        class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
      >
        {{ t(config.title!) }}
      </h3>
    </template>

    <URadioGroup v-model="delivery.type" :items="deliveryOptions">
      <template #label="{ item, modelValue }">
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-2">
            <Icon
              v-if="item?.avatar?.startsWith('mdi:')"
              :name="item.avatar"
              size="30"
              class="w-20"
            />
            <NuxtImg
              v-else
              :src="item?.avatar"
              :alt="t(item?.label)"
              loading="lazy"
              format="webp"
              width="80"
              class="w-20"
            />
            <span>
              {{ t(item?.label) }}
            </span>
            <UTooltip v-if="item?.help" :text="t(item.help)">
              <Icon name="mdi:question-mark-circle" size="20" />
            </UTooltip>
          </div>
          <span v-if="item.totalPrice! > 0">
            {{
              useToNumber(
                item?.totalPrice?.toFixed(2) || 0
              ).value.toLocaleString(locale)
            }}&nbsp;{{ t("$.czk") }}
          </span>
          <span v-else>
            {{ t("$.delivery.free") }}
          </span>
        </div>

        <CmpForm
          v-if="modelValue === item.value"
          ref="formCmp"
          :fields="config.fields || []"
          :item="delivery.address"
          variant="soft"
          :actions="{ disabled: true }"
          :ui="{
            body: 'grid md:grid-cols-2 gap-4',
          }"
          :key="delivery.key"
          class="w-full"
          @change="onChange"
        >
        </CmpForm>
      </template>
    </URadioGroup>
  </UCard>
</template>
