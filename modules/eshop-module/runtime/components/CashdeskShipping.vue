<script setup lang="ts">
import { useUrlResolver, useMenuItems } from "#imports";
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
const {
  carts,
  user,
  setUser,
  shipping,
  shippingOptions,
  setShipping,
  setShippingValid,
} = useCashdesk();
const formCmp = ref();

/**
 * Load config — synchronous (local JSON), no async needed
 */
const config = computed<IFormConfig>(() => {
  const result = CLONE(dConfig);
  updateConfig(route, result);
  return result as IFormConfig;
});

const onFormChange = useDebounceFn((body) => {
  setUser({
    ...user.value,
    address: { ...user.value.address, shipping: body },
  } as any);
  nextTick(() => _validate(formCmp.value?.form));
}, 300);

const isValid = ref(false);

async function _validate(form: any) {
  if (shipping.value.value === "free") {
    isValid.value = true;
    setShippingValid(true);
    return;
  }
  await form?.validate({ silent: true });
  isValid.value = !form?.getErrors().length;
  setShippingValid(isValid.value);
}

watch(() => formCmp.value?.form, _validate);

watch(
  () => shipping.value.value,
  (val) => {
    // Nevolat setShipping pokud options ještě nejsou načteny — způsobilo by reset na první položku
    if (val && shippingOptions.value.length) {
      setShipping(shippingOptions.value.find((d) => d.value === val));
    }
    nextTick(() => _validate(formCmp.value?.form));
  },
  { immediate: true },
);

// Když se options načtou, aktualizovat plný objekt (cena, label) pro již uloženou hodnotu
watch(shippingOptions, (opts) => {
  if (opts.length && shipping.value.value) {
    setShipping(opts.find((d) => d.value === shipping.value.value));
    nextTick(() => _validate(formCmp.value?.form));
  }
});

defineExpose({});

const showAddress = computed(
  () => !!(shipping.value.value && shipping.value.value !== "free"),
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

          <span
            class="font-bold text-secondary-600 dark:text-secondary-400 text-right"
          >
            {{
              item.price! > 0
                ? `${Number(item.price).toLocaleString(locale)} ${t("$.czk")}`
                : t("$.shipping.free")
            }}
          </span>
        </div>
      </template>
    </URadioGroup>

    <template #footer>
      <div v-show="showAddress">
        <p class="text-sm font-semibold mb-3">{{ t("$.shipping.address") }}</p>
        <CmpForm
          ref="formCmp"
          :fields="config.fields || []"
          :item="(user.address?.shipping || {}) as any"
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
      </div>
    </template>
  </UCard>
</template>
