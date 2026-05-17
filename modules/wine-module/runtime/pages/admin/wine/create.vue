<script setup lang="ts">
import wConfig from "../../../assets/configs/admin-wine-create.json";
import { useFileUpload } from "@/modules/file-module/runtime/composables/useFileUpload";

definePageMeta({
  layout: "admin",
  syscode: "admin_wine_create",
  title: "$.admin.wine.create_wine",
});

const { t } = useLang();
const { routes, route } = useMenuItems();
const title = computed(() =>
  t((route.meta.label || route.meta.title) as string)
);

const { config, loading, onCreate } = useWineAdmin(wConfig);
const { files, uploadedFiles, tempPaths, removeUploadedFile } = useFileUpload();
const uploadField = {
  name: "paths",
  type: "file",
  multiple: true,
  required: false,
  fileSize: 20,
  fileTypes: [
    {
      label: "JPG, PNG, GIF, WEBP, PDF",
      value: [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf",
      ],
    },
  ],
} as any;

useHead({
  title,
  meta: [
    { name: "description", content: t("$.base.description") },
    { name: "keywords", content: t("$.base.description") },
  ],
});

async function onFormSubmit(formData: Record<string, any>) {
  await onCreate({
    ...formData,
    paths: tempPaths.value.length > 0 ? tempPaths.value : undefined,
  });
}
</script>

<template>
  <div v-if="config" :id="config.syscode" class="w-full max-w-7xl mx-auto px-5">
    <UPageHeader
      :title="title"
      :ui="{ title: 'mx-auto text-primary-600 dark:text-white' }"
      class="border-none"
    />

    <div class="space-y-6">
      <CmpForm
        :fields="config.fields"
        :loading="loading"
        :actions="{
          no: { link: routes.admin_wine as any },
        }"
        :ui="{
          body: 'grid md:grid-cols-2 gap-4',
        }"
        @submit="onFormSubmit"
      />

      <!-- File Upload Section -->
      <UCard class="w-full">
        <template #header>
          <h3 class="text-lg font-semibold">{{ $t("$.form.files") || "Files" }}</h3>
        </template>
        
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {{ $t("$.form.files_will_upload_after_create") || "Select files to upload. They will be attached after the product is created." }}
        </p>
        
        <UiFileUpload
          :field="uploadField"
          :files="files"
          :uploaded-files="uploadedFiles"
          @delete="removeUploadedFile"
        />
      </UCard>
    </div>
  </div>
</template>
