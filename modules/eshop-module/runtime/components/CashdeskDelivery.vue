<script setup lang="ts">
import { useUrlResolver, useAsyncData, useMenuItems } from "#imports";
import { useDebounceFn } from "@vueuse/core";

import { CLONE } from "@suku-kahanamoku/common-module/utils";
import type { IFormConfig } from "@suku-kahanamoku/form-module/types";

import dConfig from "../assets/configs/delivery.json";

const {
  i18n: { locale },
  t,
} = useLang();
const { route } = useMenuItems();
const { updateConfig } = useUrlResolver();
const { loggedIn } = useUserSession();
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

const onFormChange = useDebounceFn(
  (body) => setDelivery(delivery.value, body),
  300
);

async function validate(form: any) {
  await form?.validate({ silent: true });
  delivery.value.valid = form?.getErrors().length ? false : true;
}

watch(() => formCmp.value?.form, validate);
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
      v-model="delivery.type"
      :items="deliveryOptions"
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

          <UiPrice v-if="item.totalPrice! > 0" :price="item?.totalPrice!" />
          <span v-else>
            {{ t("$.delivery.free") }}
          </span>
        </div>
      </template>
    </URadioGroup>

    <template #footer>
      <UAccordion
        :items="[{ label: t('$.delivery.address') }]"
        :unmount-on-hide="false"
      >
        <template #body>
          <CmpForm
            ref="formCmp"
            :fields="config.fields || []"
            :item="delivery.address"
            variant="outline"
            :actions="{ disabled: true }"
            :ui="{
              body: 'grid md:grid-cols-2 gap-4',
            }"
            :key="delivery.key"
            class="w-full"
            @change="onFormChange"
          >
          </CmpForm>
        </template>
      </UAccordion>
    </template>
  </UCard>
</template>
