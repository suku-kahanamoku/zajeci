<script setup lang="ts">
definePageMeta({
  syscode: "cashdesk_completed",
  title: "$.cashdesk_completed.title",
});

const { t } = useLang();
const route = useRoute();
const { routes } = useMenuItems();
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
  <div class="max-w-screen-xl mx-auto px-5 w-full">
    <div id="cashdesk-completed" class="py-10">
      <UCard class="max-w-lg mx-auto">
        <h1 class="text-2xl font-bold text-gray-800 mb-4">
          {{ title }}
        </h1>
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
          :to="localePath(routes.wine.path)"
          icon="i-heroicons-arrow-left"
        >
          {{ $tt("$.btn.back_shopping") }}
        </UButton>
      </UCard>
    </div>
  </div>
</template>
