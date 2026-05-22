<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { IMailTemplate } from "@/modules/mail-module/runtime/types/mail.types";
import sConfig from "../../../assets/configs/admin-mail-send.json";

definePageMeta({
  layout: "admin",
  syscode: "admin_mail",
  title: "$.admin.mail.title",
});

const { t } = useLang();
const title = computed(() => t("$.admin.mail.title"));
const {
  mails,
  listLoading,
  config,
  loading,
  isDialogOpen,
  selectedTemplate,
  openSendDialog,
  onSend,
} = useMailAdmin(sConfig);

useHead({
  title,
  meta: [{ name: "description", content: title.value }],
});

const columns: TableColumn<IMailTemplate>[] = [
  {
    accessorKey: "template",
    header: () => t("$.mail.template"),
  },
  {
    accessorKey: "actions",
    header: "",
  },
];
</script>

<template>
  <div class="w-full max-w-7xl mx-auto px-5">
    <UPageHeader
      :title="title"
      :ui="{ title: 'mx-auto text-primary-600 dark:text-white' }"
      class="border-none"
    />

    <UTable :columns="columns" :data="mails" :loading="listLoading">
      <template #actions-cell="{ row }">
        <div class="flex justify-end">
          <UButton
            icon="i-heroicons-paper-airplane"
            color="primary"
            variant="ghost"
            :aria-label="t('$.admin.mail.send')"
            @click="openSendDialog(row.original.template)"
          />
        </div>
      </template>
    </UTable>

    <UModal v-model:open="isDialogOpen" :title="selectedTemplate ?? ''">
      <template #body>
        <CmpForm
          v-if="config"
          :fields="config.fields"
          :loading="loading"
          :ui="{ body: 'grid md:grid-cols-1 gap-4' }"
          @submit="onSend($event)"
        />
      </template>
    </UModal>
  </div>
</template>
