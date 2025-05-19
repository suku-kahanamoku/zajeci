<script setup lang="ts">
import { object, string, boolean, type InferType, number, array } from "yup";
import type { FormSubmitEvent } from "#ui/types";

import type { WineDocument } from "@/modules/wine-module/runtime/types/wine.type";
import { CLONE } from "@/modules/common-module/runtime/utils/modify-object.functions";

definePageMeta({
  layout: "admin",
  syscode: "admin_wine_create",
  title: "$.admin.wine.create.title",
  middleware: () => {
    const auth = useAuthStore();

    if (!auth.isAdmin) {
      return navigateTo("/403");
    }
  },
});

const { $tt } = useNuxtApp();
const toast = useToast();
const today = new Date();
const loading = ref();
const { defaultItem } = useWines();

useHead({
  title: $tt("$.admin.wine.create.title"),
  meta: [
    { name: "description", content: $tt("$.base.description") },
    { name: "keywords", content: $tt("$.base.description") },
  ],
});

const schema = object({
  name: string().required(),
  description: string().required(),
  kind: string().required(),
  quality: string().required(),
  color: string().required(),
  variety: string().required(),
  volume: number().required().positive(),
  year: number()
    .required()
    .positive()
    .integer()
    .min(2000)
    .max(today.getFullYear()),
  price: number().required().positive().integer(),
  quantity: number().required().positive().integer(),
  /* categories: array().required().min(1), */
  categories: array(),
  published: boolean(),
});

const state = ref<WineDocument>(CLONE(defaultItem));

async function onSubmit(event: FormSubmitEvent<InferType<typeof schema>>) {
  loading.value = true;
  try {
    await $fetch("/api/admin/wine", { method: "POST", body: event.data });
    state.value = CLONE(defaultItem);
    toast.add({
      title: $tt("$.form.post_success_msg"),
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
            {{ $tt("$.admin.wine.create.title") }}
          </h1>

          <CmpWineForm
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
