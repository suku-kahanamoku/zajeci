<script setup lang="ts">
import type { IOrder } from "~/modules/eshop-module/runtime/types/order.interface";

definePageMeta({
  layout: "admin",
  syscode: "admin_order",
  title: "$.admin.order.title",
  middleware: () => {
    const auth = useAuthStore();

    if (!auth.isAdmin) {
      return navigateTo("/403");
    }
  },
});

const { $tt } = useNuxtApp();
const localePath = useLocalePath();
const { routes } = useMenuItems();
const toast = useToast();
const deleteItem = ref<IOrder>();
const isOpen = ref(false);

useHead({
  title: `${$tt("$.base.title")} | ${$tt("$.dashboard.title")}`,
  meta: [
    { name: "description", content: $tt("$.base.description") },
    { name: "keywords", content: $tt("$.base.description") },
  ],
});

const {
  data: orders,
  refresh,
  pending,
} = await useAsyncData(async (): Promise<IOrder[] | undefined> => {
  try {
    return await $fetch<IOrder[]>(`/api/admin/order`);
  } catch (error: any) {
    console.error(error);
  }
});

async function onDelete(value: boolean) {
  if (value) {
    const method = "DELETE";
    try {
      await $fetch(`/api/admin/order/${deleteItem.value?._id}`, {
        method,
      });
      toast.add({
        title: $tt("$.form.delete_success_msg"),
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
    delete deleteItem.value;
    isOpen.value = false;
    await refresh();
  }
}
</script>

<template>
  <div class="max-w-screen-xl mx-auto px-5 w-full">
    <div id="dashboard" class="py-10">
      <h1
        class="text-center text-primary-600 text-4xl lg:text-5xl font-bold tracking-tight dark:text-primary-400"
      >
        {{ $tt("$.admin.order.title") }}
      </h1>

      <div class="flex justify-end">
        <UButton
          :to="localePath(routes.admin_order_create?.path)"
          icon="i-heroicons-plus-circle"
          class="text-orange-600 dark:text-orange-600"
          :ui="{ rounded: 'rounded-full' }"
          variant="ghost"
          :aria-label="$tt('$.aria.delete_selected')"
          :loading="pending"
        />
      </div>

      <AdminListOrder
        :orders="orders || []"
        :pending="pending"
        @delete="
          deleteItem = $event;
          isOpen = true;
        "
      />
    </div>

    <UiModalConfirm
      v-model="isOpen"
      color="error"
      :btns="{
        ok: {
          icon: 'i-heroicons-trash',
        },
      }"
      @confirm="onDelete"
    >
      <template #header>
        {{ $tt("$.btn.delete") }}
      </template>

      {{ $tt("$.message.delete_question", { name: deleteItem?._id }) }}
    </UiModalConfirm>
  </div>
</template>
