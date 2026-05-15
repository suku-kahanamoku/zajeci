<script setup lang="ts">
import { useUrlResolver, useAsyncData, useMenuItems } from "#imports";
import { useDebounceFn } from "@vueuse/core";

import { CLONE } from "@suku-kahanamoku/common-module/utils";
import type { IFormConfig } from "@suku-kahanamoku/form-module/types";

import dConfig from "../assets/configs/shipping.json";

const {
  i18n: { locale },
  t,
} = useLang();
const { route } = useMenuItems();
const { updateConfig } = useUrlResolver();
const { loggedIn } = useUserSession();
const { carts, user, setUser, shipping, shippingOptions, setShipping } =
  useCashdesk();
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
  { watch: [() => route.query] },
);

const onFormChange = useDebounceFn(
  (body) =>
    setUser({
      ...user.value,
      address: { ...user.value.address, shipping: body },
    } as any),
  300,
);

async function validate(form: any) {
  if (shipping.value.value === "free") {
    shipping.value.valid = true;
    return;
  }
  await form?.validate({ silent: true });
  shipping.value.valid = form?.getErrors().length ? false : true;
}

watch(() => formCmp.value?.form, validate);

watch(
  () => shipping.value.value,
  (val) => {
    setShipping(shippingOptions.value.find((d) => d.value === val));
    nextTick(() => validate(formCmp.value?.form));
  },
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
      v-model="shipping.value"
      :items="shippingOptions"
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
            <UIcon
              v-if="item?.icon?.startsWith('mdi:')"
              :name="item.icon"
              size="30"
              class="w-20"
            />
            <NuxtImg
              v-else
              :src="item?.icon"
              :alt="item?.label"
              loading="lazy"
              format="webp"
              width="80"
              class="w-20"
            />
            <span>
              {{ item?.label }}
            </span>
            <UTooltip v-if="item?.help" :text="t(item.help)">
              <UIcon name="mdi:question-mark-circle" size="20" />
            </UTooltip>
          </div>

          <span class="font-bold text-secondary-600 dark:text-secondary-400">
            {{ item.price! > 0 ? `${Number(item.price).toLocaleString(locale)} ${t('$.czk')}` : t('$.shipping.free') }}
          </span>
        </div>
      </template>
    </URadioGroup>

    <template #footer>
      <UAccordion
        :items="[{ label: t('$.shipping.address') }]"
        :unmount-on-hide="false"
      >
        <template #body>
          <CmpForm
            ref="formCmp"
            :fields="config.fields || []"
            :item="user.address?.shipping || {}"
            variant="outline"
            :actions="{ disabled: true }"
            :ui="{
              body: 'grid md:grid-cols-2 gap-4',
            }"
            :key="shipping.key"
            class="w-full"
            @change="onFormChange"
          >
          </CmpForm>
        </template>
      </UAccordion>
    </template>
  </UCard>
</template>
