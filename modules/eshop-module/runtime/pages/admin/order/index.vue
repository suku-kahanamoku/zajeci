<script setup lang="ts">
import type { IOrder } from "@/modules/eshop-module/runtime/types/order.interface";

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

const { t } = useLang();
const localePath = useLocalePath();
const { routes, route } = useMenuItems();
const toast = useToast();
const deleteItem = ref<IOrder>();
const isOpen = ref(false);
const title = computed(() => t(route.meta.title as string));

useHead({
  title,
  meta: [
    { name: "description", content: t("$.base.description") },
    { name: "keywords", content: t("$.base.description") },
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
        title: t("$.form.delete_success_msg"),
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
          variant="ghost"
          :aria-label="$tt('$.aria.delete_selected')"
          :loading="pending"
        />
      </div>

      <OrderList
        :orders="orders || []"
        :pending="pending"
        @delete="
          deleteItem = $event;
          isOpen = true;
        "
      />
    </div>

    <CmpConfirmDialog
      v-model="isOpen"
      :title="$tt('$.btn.delete')"
      color="error"
      :btns="{
        ok: {
          icon: 'i-heroicons-trash',
        },
      }"
      @confirm="onDelete"
    >
      {{ $tt("$.message.delete_question", { name: deleteItem?._id }) }}
    </CmpConfirmDialog>
  </div>
</template>
