<script setup lang="ts">
definePageMeta({
  syscode: "cashdesk_completed",
  title: "$.cashdesk_completed.title",
});

const { t } = useLang();
const { route, routes } = useMenuItems();
const localePath = useLocalePath();
const title = computed(() => t(route.meta.title as string));

useHead({
  title,
  meta: [
    { name: "description", content: t("$.base.description") },
    { name: "keywords", content: t("$.base.description") },
  ],
});
</script>

<template>
  <div
    :id="(routes.cashdesk_completed?.meta?.syscode as string)"
    class="w-full max-w-7xl mx-auto px-5"
  >
    <UPageHeader
      :title="title"
      :ui="{ title: 'mx-auto text-primary-600 dark:text-white' }"
      class="border-none"
    />

    <UCard class="max-w-lg mx-auto" variant="subtle">
      <p
        class="text-gray-700 mb-4"
        v-html="
          $tt('$.cashdesk_completed.order', {
            orderId: `<strong>${route.query.orderId}</strong>`,
          })
        "
      />
      <p
        class="text-gray-700 mb-4"
        v-html="
          $tt('$.cashdesk_completed.send_to_email', {
            email: `<strong>${route.query.email}</strong>`,
          })
        "
      />
      <p class="text-gray-700">{{ $tt("$.cashdesk_completed.thank_you") }}</p>
      <UButton
        class="mt-6"
        :to="localePath(routes.wine?.path!)"
        icon="i-heroicons-arrow-left"
        variant="outline"
      >
        {{ $tt("$.btn.back_shopping") }}
      </UButton>
    </UCard>
  </div>
</template>
