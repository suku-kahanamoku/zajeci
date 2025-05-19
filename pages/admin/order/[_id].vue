<script setup lang="ts">
import { object, string, boolean, type InferType, number, array } from "yup";
import type { FormSubmitEvent } from "#ui/types";

import type { IOrder } from "@/server/types/order.type";
import { CLONE } from "@/modules/common-module/runtime/utils/modify-object.functions";

definePageMeta({
  layout: "admin",
  syscode: "admin_order_update",
  title: "$.admin.order.update.title",
  middleware: () => {
    const auth = useAuthStore();

    if (!auth.isAdmin) {
      return navigateTo("/403");
    }
  },
});

const { $tt } = useNuxtApp();
const route = useRoute();
const toast = useToast();
const today = new Date();
const { getChangedParams } = useOrders();

useHead({
  title: `${$tt("$.base.title")} | ${$tt("$.forgot_password.title")}`,
  meta: [
    { name: "description", content: $tt("$.base.description") },
    { name: "keywords", content: $tt("$.base.description") },
  ],
});

const schema = object({
  user: object({
    email: string().required(),
    name: string().required(),
    surname: string().required(),
    phone: string().required(),
  }),
  carts: array()
    .of(
      object({
        wine: string().required(),
        quantity: number().required().positive().integer(),
        unitPrice: number().required().positive(),
        totalPrice: number().required().positive(),
      })
    )
    .required(),
  totalPrice: number().required().positive(),
  status: string().required(),
  delivery: object({
    type: string().required(),
    address: object({
      street: string().required(),
      city: string().required(),
      state: string().required(),
      zip: string().required(),
      country: string(),
    }).required(),
    totalPrice: number().required().positive(),
  }),
  payment: object({
    type: string().required(),
    totalPrice: number().required().positive(),
  }),
});

const { data: order, pending } = await useAsyncData(async () => {
  try {
    return await $fetch(`/api/admin/order/${route.params._id}`);
  } catch (error: any) {
    console.error(error);
  }
});

const state = ref<IOrder>(CLONE(order.value));

async function onSubmit(event: FormSubmitEvent<InferType<typeof schema>>) {
  pending.value = true;
  try {
    const changedParams = getChangedParams(order.value as any, event.data);
    const result = await $fetch(`/api/admin/order/${route.params._id}`, {
      method: "PATCH",
      body: changedParams,
    });
    state.value = CLONE(result);
    toast.add({
      title: $tt("$.form.patch_success_msg"),
      color: "success",
      icon: "i-heroicons-check",
    });
  } catch (error: any) {
    toast.add({
      title: error.data.message,
      color: "error",
      icon: "i-heroicons-exclamation-circle",
    });
  }
  setTimeout(() => (pending.value = false), 400);
}
</script>

<template>
  <div class="flex w-full">
    <div class="flex items-center justify-center mx-auto w-full sm:py-12">
      <div
        class="w-full border rounded-lg shadow-md sm:max-w-lg md:max-w-xl dark:border dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
          >
            {{ $tt("$.admin.order.update.title", { name: state?._id }) }}
          </h1>

          <AdminFormOrder
            v-if="state"
            :schema="schema"
            :item="state"
            :loading="pending"
            @submit="onSubmit"
          />
        </div>
      </div>
    </div>
  </div>
</template>
