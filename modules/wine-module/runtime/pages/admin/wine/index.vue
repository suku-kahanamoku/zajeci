<script setup lang="ts">
import type { IWine } from "@/modules/wine-module/runtime/types/wine.interface";

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
const { routes } = useMenuItems();
const toast = useToast();
const selected = ref<IWine[]>([]);
const isOpen = ref(false);

useHead({
  title: `${$tt("$.base.title")} | ${$tt("$.dashboard.title")}`,
  meta: [
    { name: "description", content: $tt("$.base.description") },
    { name: "keywords", content: $tt("$.base.description") },
  ],
});

const {
  data: wines,
  refresh,
  pending,
} = await useAsyncData(async (): Promise<IWine[] | undefined> => {
  try {
    return await $fetch<IWine[]>(`/api/wine`);
  } catch (error: any) {
    console.error(error);
  }
});

async function onDelete(value: boolean) {
  if (value && selected.value?.length) {
    const method = "DELETE";
    try {
      if (selected.value.length === 1) {
        // Single delete
        await $fetch(`/api/admin/wine/${selected.value[0]._id}`, {
          method,
        });
      } else {
        // Multiple delete
        const ids = selected.value.map((wine) => wine._id).join('","');
        await $fetch(`/api/admin/wine?q={"_id":{"$in":["${ids}"]}}`, {
          method,
        });
      }
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
    selected.value = [];
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
          variant="ghost"
          :aria-label="$tt('$.aria.delete_selected')"
          :disabled="!selected.length"
          :loading="pending"
          @click="isOpen = true"
        />
        <UButton
          :to="localePath(routes.admin_wine_create?.path)"
          icon="i-heroicons-plus-circle"
          class="text-orange-600 dark:text-orange-600"
          variant="ghost"
          :aria-label="$tt('$.aria.delete_selected')"
          :loading="pending"
        />
      </div>

      <AdminListWine
        v-model="selected"
        :wines="wines || []"
        :pending="pending"
        @delete="
          selected = [$event];
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
      {{
        selected?.length > 1
          ? $tt("$.message.delete_question_multi", {
              length: selected?.length,
            })
          : $tt("$.message.delete_question", { name: selected?.[0]?.name })
      }}
    </CmpConfirmDialog>
  </div>
</template>
