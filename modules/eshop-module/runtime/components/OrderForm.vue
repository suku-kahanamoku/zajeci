<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";
import type { IOrder } from "@/modules/eshop-module/runtime/types/order.interface";
import type { Schema } from "yup";

const emits = defineEmits<{
  (event: "submit", val: FormSubmitEvent<any>): void;
}>();

defineProps<{
  schema: Schema;
  item: IOrder;
  loading?: boolean;
}>();

const localePath = useLocalePath();
const { fields } = useOrders();
const { routes } = useMenuItems();
</script>

<template>
  <UForm :schema="schema" :state="item" @submit="emits('submit', $event)">
    <UFormField :label="fields.userEmail.label" name="user.email" class="mb-6">
      <UInput
        v-model="item.user.email"
        :placeholder="fields.userEmail.placeholder"
        size="lg"
        required
      />
    </UFormField>

    <UFormField :label="fields.userName.label" name="user.name" class="mb-6">
      <UInput
        v-model="item.user.name"
        :placeholder="fields.userName.placeholder"
        size="lg"
        required
      />
    </UFormField>

    <UFormField
      :label="fields.userSurname.label"
      name="user.surname"
      class="mb-6"
    >
      <UInput
        v-model="item.user.surname"
        :placeholder="fields.userSurname.placeholder"
        size="lg"
        required
      />
    </UFormField>

    <UFormField :label="fields.userPhone.label" name="user.phone" class="mb-6">
      <UInput
        v-model="item.user.phone"
        :placeholder="fields.userPhone.placeholder"
        size="lg"
        required
      />
    </UFormField>

    <UFormField :label="fields.deliveryType.label" name="delivery.type">
      <UInput
        v-model="item.delivery.type"
        :placeholder="fields.deliveryType.placeholder"
        size="lg"
        required
      />
    </UFormField>

    <UFormField :label="fields.paymentType.label" name="payment.type">
      <UInput
        v-model="item.payment.type"
        :placeholder="fields.paymentType.placeholder"
        size="lg"
        required
      />
    </UFormField>

    <UFormField :label="fields.totalPrice.label" name="totalPrice">
      <UInput v-model="item.totalPrice" type="number" size="lg" required />
    </UFormField>

    <div class="flex justify-between pt-8">
      <UButton
        :to="localePath(routes.admin_order?.path)"
        icon="i-heroicons-arrow-left"
        variant="outline"
        size="lg"
      >
        {{ $tt("$.btn.back") }}
      </UButton>
      <UButton
        type="submit"
        size="lg"
        :loading="loading"
        class="dark:text-white"
      >
        {{ $tt("$.btn.submit") }}
      </UButton>
    </div>
  </UForm>
</template>
