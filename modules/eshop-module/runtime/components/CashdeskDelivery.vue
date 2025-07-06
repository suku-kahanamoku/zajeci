<script setup lang="ts">
import { useUrlResolver, useAsyncData, useMenuItems } from "#imports";
import defu from "defu";
import { useToNumber } from "@vueuse/core";

import {
  CLONE,
  CONVERT_DOT_TO_OBJECT,
} from "@/modules/common-module/runtime/utils/modify-object.functions";
import type { IFormField } from "@/modules/form-module/runtime/types/field.interface";

import dConfig from "../assets/configs/delivery.json";

const {
  i18n: { locale },
} = useLang();
const { route } = useMenuItems();
const { updateConfig } = useUrlResolver();
const cashdesk = useCashdeskStore();

/**
 * Load config
 */
const { data: config } = await useAsyncData(
  async () => {
    try {
      const result = CLONE(dConfig);
      updateConfig(route, result);
      return result as typeof dConfig;
    } catch (error: any) {
      return {} as typeof dConfig;
    }
  },
  { watch: [() => route.query] }
);

function onChange(body: Record<string, any>, event: any) {
  if (config.value) {
    const data = CLONE(body);
    CONVERT_DOT_TO_OBJECT(data);
    cashdesk.delivery = defu(data.delivery, cashdesk.delivery);
  }
}
</script>
<template>
  <UCard variant="subtle" class="w-full">
    <template #header>
      <h3
        class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
      >
        {{ $tt(config?.title!) }}
      </h3>
    </template>

    <URadioGroup
      v-model="cashdesk.delivery.type"
      :items="cashdesk.deliveryOptions"
    >
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
              :alt="$tt(item?.label)"
              loading="lazy"
              format="webp"
              width="80"
              class="w-20"
            />
            <span>
              {{ $tt(item?.label) }}
            </span>
            <UTooltip v-if="item?.help" :text="$tt(item.help)">
              <Icon name="mdi:question-mark-circle" size="20" />
            </UTooltip>
          </div>
          <span v-if="item.price! > 0">
            {{
              useToNumber(item?.price?.toFixed(2) || 0).value.toLocaleString(
                locale
              )
            }}&nbsp;{{ $tt("$.czk") }}
          </span>
          <span v-else>
            {{ $tt("$.delivery.free") }}
          </span>
        </div>

        <CmpForm
          v-if="modelValue === item.value"
          :fields="(config?.fields as IFormField[])"
          :item="(cashdesk as any)"
          variant="soft"
          :actions="{ disabled: true }"
          :ui="{
            body: 'grid md:grid-cols-2 gap-4',
          }"
          :key="cashdesk.delivery.key"
          class="w-full"
          @change="onChange"
        >
        </CmpForm>
      </template>
    </URadioGroup>
  </UCard>
</template>
