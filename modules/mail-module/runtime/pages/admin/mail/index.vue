<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { IMailTemplate } from "@/modules/mail-module/runtime/types/mail.types";

definePageMeta({
  layout: "admin",
  syscode: "admin_mail",
  title: "$.admin.mail.title",
});

const { t } = useLang();
const title = computed(() => t("$.admin.mail.title"));
const { mails, loading, sending, sendMail } = useMailAdmin();

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

    <UTable :columns="columns" :data="mails" :loading="loading">
      <template #actions-cell="{ row }">
        <div class="flex justify-end">
          <UButton
            icon="i-heroicons-paper-airplane"
            color="primary"
            variant="ghost"
            :aria-label="t('$.admin.mail.send_success')"
            :loading="sending === row.original.template"
            @click="sendMail(row.original.template)"
          />
        </div>
      </template>
    </UTable>
  </div>
</template>
