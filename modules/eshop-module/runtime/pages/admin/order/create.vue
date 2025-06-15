<script setup lang="ts">
import { object, string, boolean, type InferType, number, array } from "yup";
import type { FormSubmitEvent } from "#ui/types";

import type { IOrder } from "@/modules/eshop-module/runtime/types/order.interface";
import { CLONE } from "@/modules/common-module/runtime/utils/modify-object.functions";

definePageMeta({
  layout: "admin",
  syscode: "admin_order_create",
  title: "$.admin.order.create.title",
  middleware: () => {
    const auth = useAuthStore();

    if (!auth.isAdmin) {
      return navigateTo("/403");
    }
  },
});

const { t } = useLang();
const route = useRoute();
const toast = useToast();
const loading = ref();
const { defaultItem } = useOrders();

const title = computed(() => t(route.meta.title as string));

useHead({
  title,
  meta: [
    { name: "description", content: t("$.base.description") },
    { name: "keywords", content: t("$.base.description") },
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

const state = ref<IOrder>(CLONE(defaultItem));

async function onSubmit(event: FormSubmitEvent<InferType<typeof schema>>) {
  loading.value = true;
  try {
    await $fetch("/api/admin/order", { method: "POST", body: event.data });
    state.value = CLONE(defaultItem);
    toast.add({
      title: t("$.form.post_success_msg"),
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
  loading.value = false;
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
            {{ $tt("$.admin.order.create.title") }}
          </h1>

          <OrderForm
            :schema="schema"
            :item="state"
            :loading="loading"
            @submit="onSubmit"
          />
        </div>
      </div>
    </div>
  </div>
</template>
