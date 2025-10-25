<script setup lang="ts">
import { useToNumber } from "@vueuse/core";

import type { ICart } from "@/modules/eshop-module/runtime/types/order.interface";

const props = defineProps<{
  cart?: ICart;
}>();

const model = defineModel<boolean>();

const {
  i18n: { locale },
} = useLang();
const { routes } = useMenuItems();
const cashdesk = useCashdeskStore();
</script>

<template>
  <UModal
    v-model:open="model"
    :title="$tt('$.cart.added', { name: cart?.wine?.name })"
    close-icon="i-heroicons-x-mark"
    :ui="{
      footer: 'flex justify-between items-center gap-2'
    }"
  >
    <template #body>
      <h3
        class="font-medium text-xl lg:text-2xl text-gray-700 dark:text-primary-400"
      >
        {{ cart?.wine?.name }}
      </h3>
      <div class="mt-6 flex flex-col gap-2">
        <div>
          {{ $tt("$.form.price") }}:&nbsp;{{
            useToNumber(cart?.totalPrice?.toFixed(2) || 0).value.toLocaleString(
              locale
            )
          }}&nbsp;{{ $tt("$.czk") }}
        </div>
        <div>
          {{ $tt("$.form.quantity") }}:&nbsp;{{
            useToNumber(cart?.quantity || 1).value.toLocaleString(locale)
          }}&nbsp;{{ $tt("$.pcs") }}
        </div>
        <div>
          {{ $tt("$.cart.total") }}:&nbsp;{{
            useToNumber(
              cashdesk?.totalPrice?.toFixed(2) || 0
            ).value.toLocaleString(locale)
          }}&nbsp;{{ $tt("$.czk") }}
        </div>
      </div>
      <UAlert
        icon="i-heroicons-truck"
        :title="$tt('$.delivery.limit_free')"
        color="info"
        variant="subtle"
        class="mt-5"
      />
    </template>

    <template #footer>
      <!-- Tlačítko "Ne" -->
      <UButton
        data-testid="dialog-no"
        :label="$tt('$.btn.continue_shopping')"
        color="neutral"
        variant="ghost"
        @click="model = false"
      />

      <!-- Tlačítko "Ano" -->
      <UButton
        :to="routes.cashdesk?.path"
        data-testid="dialog-yes"
        :label="$tt('$.btn.to_order')"
        size="xl"
        color="primary"
      />
    </template>
  </UModal>
</template>
