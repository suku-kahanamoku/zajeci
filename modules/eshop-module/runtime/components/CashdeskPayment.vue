<script setup lang="ts">
import { useUrlResolver, useAsyncData, useMenuItems } from "#imports";
import { useToNumber } from "@vueuse/core";

import { CLONE } from "@suku-kahanamoku/common-module/utils";

import pConfig from "../assets/configs/payment.json";

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
  <UCard variant="subtle" class="w-full">
    <template #header>
      <h3
        class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
      >
        {{ $tt(config?.title!) }}
      </h3>
    </template>

    <URadioGroup
      v-model="cashdesk.payment.type"
      :items="cashdesk.paymentOptions"
    >
      <template #label="{ item }">
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-2">
            <Icon :name="item.avatar as string" size="30" class="w-20" />
            <span>
              {{ $tt(item?.label) }}
            </span>
          </div>
          <span v-if="item.price! > 0">
            {{
              useToNumber(item?.price?.toFixed(2) || 0).value.toLocaleString(
                locale
              )
            }}&nbsp;{{ $tt("$.czk") }}
          </span>
          <span v-else>
            {{ $tt("$.btn.free") }}
          </span>
        </div>
      </template>
    </URadioGroup>
  </UCard>
</template>
