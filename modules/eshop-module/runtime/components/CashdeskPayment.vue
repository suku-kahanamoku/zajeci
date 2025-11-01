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
const { payment, paymentOptions, setPayment } = useCashdesk();
const { t } = useLang();

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

watch(
  () => payment.value.type,
  (val) => {
    setPayment(paymentOptions.value.find((d) => d.type === val));
  }
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

    <URadioGroup
      v-model="payment.type"
      :items="paymentOptions"
      :ui="{ item: 'items-center' }"
    >
      <template #label="{ item }">
        <div
          class="flex items-center justify-between w-full"
          :class="
            item.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          "
        >
          <div class="flex items-center gap-2">
            <Icon :name="item.avatar as string" size="30" class="w-20" />
            <span>
              {{ t(item?.label) }}
            </span>
          </div>

          <UiPrice v-if="item.totalPrice! > 0" :price="item?.totalPrice!" />
          <span v-else>
            {{ t("$.btn.free") }}
          </span>
        </div>
      </template>
    </URadioGroup>
  </UCard>
</template>
