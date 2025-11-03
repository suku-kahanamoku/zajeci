<script setup lang="ts">
import { useToNumber } from "@vueuse/core";

import type { ICart } from "@/modules/eshop-module/runtime/types/order.interface";

const props = defineProps<{
  cart?: ICart;
}>();

const open = defineModel<boolean>();

const {
  i18n: { locale },
} = useLang();
const { routes } = useMenuItems();
const { totalPrice } = useCashdesk();
</script>

<template>
  <UModal
    v-model:open="open"
    :title="$tt('$.cart.added', { name: cart?.wine?.name })"
    close-icon="i-heroicons-x-mark"
    :ui="{
      footer: 'flex justify-between items-center gap-2',
    }"
  >
    <template #title>
      <h3 class="text-xl font-bold text-primary-600 dark:text-white">
        {{ $tt("$.cart.added", { name: cart?.wine?.name }) }}
      </h3>
    </template>

    <template #body>
      <div class="space-y-2">
        <div class="flex">
          {{ $tt("$.form.price") }}:&nbsp;<UiPrice :price="cart?.unitPrice!" />
        </div>
        <div>
          {{ $tt("$.form.quantity") }}:&nbsp;{{
            useToNumber(cart?.quantity || 1).value.toLocaleString(locale)
          }}&nbsp;{{ $tt("$.pcs") }}
        </div>
        <div class="flex">
          {{ $tt("$.cart.total") }}:&nbsp;<UiPrice :price="totalPrice!" />
        </div>
      </div>
      <UAlert
        icon="i-heroicons-truck"
        :title="$tt('$.delivery.limit_free')"
        color="info"
        variant="outline"
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
        @click="open = false"
      />

      <!-- Tlačítko "Ano" -->
      <UButton
        :to="routes.cashdesk?.path"
        data-testid="dialog-yes"
        :label="$tt('$.btn.to_order')"
        color="primary"
      />
    </template>
  </UModal>
</template>
