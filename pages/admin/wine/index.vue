<script setup lang="ts">
import type { WineDocument } from "@/server/types/wine.type";
import WineList from "@/admin/list/Wine.vue";

definePageMeta({
  layout: "admin",
  syscode: "admin_wine",
  title: "$.admin.wine.title",
  middleware: () => {
    const auth = useAuthStore();

    if (!auth.isAdmin) {
      return navigateTo("/403");
    }
  },
});

const { $tt } = useNuxtApp();
const localePath = useLocalePath();
const { kinds, colors, categories, fieldOptions } = useWines();
const { routes } = useMenuItems();
const toast = useToast();
const selected = ref([]);
const isOpen = ref(false);
const deleted = ref();

useHead({
  title: `${$tt("$.base.title")} | ${$tt("$.dashboard.title")}`,
  meta: [
    { name: "description", content: $tt("$.base.description") },
    { name: "keywords", content: $tt("$.base.description") },
  ],
});

const columns = fieldOptions.map((field) => ({
  ...field,
  ...{ sortable: true },
}));

const {
  data: wines,
  refresh,
  pending,
} = await useAsyncData(async (): Promise<WineDocument[] | undefined> => {
  try {
    return await $fetch<WineDocument[]>(`/api/wine`);
  } catch (error: any) {
    console.error(error);
  }
});

async function onDelete(value: boolean) {
  if (value) {
    try {
      await $fetch(`/api/admin/wine/${deleted.value._id}`, {
        method: "DELETE",
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
    deleted.value = null;
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
        {{ $tt("$.admin.wine.title") }}
      </h1>

      <div class="flex justify-end">
        <UButton
          icon="i-heroicons-trash"
          class="text-error-600 dark:text-error-600"
          :ui="{ rounded: 'rounded-full' }"
          variant="ghost"
          :aria-label="$tt('$.aria.delete_selected')"
          :disabled="!selected.length"
          :loading="pending"
        />
        <UButton
          :to="localePath(routes.admin_wine_create?.path)"
          icon="i-heroicons-plus-circle"
          class="text-orange-600 dark:text-orange-600"
          :ui="{ rounded: 'rounded-full' }"
          variant="ghost"
          :aria-label="$tt('$.aria.delete_selected')"
          :loading="pending"
        />
      </div>

      <WineList
        v-model="selected"
        :columns="columns"
        :rows="wines || []"
        :kinds="kinds"
        :colors="colors"
        :categories="categories"
        :routes="routes"
        :pending="pending"
        @delete="onDelete"
      />
    </div>

    <UiModalConfirm v-model="isOpen" @confirm="onDelete">
      {{ $tt("$.message.delete_question", { name: deleted?.name }) }}
    </UiModalConfirm>
  </div>
</template>
