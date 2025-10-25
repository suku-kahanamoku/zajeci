<script setup lang="ts">
definePageMeta({
  syscode: "cashdesk",
  title: "$.cashdesk.title",
});

const { t } = useLang();
const route = useRoute();
const router = useRouter();
const { routes } = useMenuItems();
const title = computed(() => t(route.meta.title as string));

useHead({
  title,
  meta: [
    { name: "description", content: t("$.base.description") },
    { name: "keywords", content: t("$.base.description") },
  ],
});

const { carts, user, delivery, payment, loading, onSubmit } =
  useCashdeskStore();

const backBtn = computed(() => {
  if (stepper.value?.hasPrev) {
    return steps.value[selectedStep.value - 1]?.title;
  } else {
    return "$.btn.back_shopping";
  }
});
const nextBtn = computed(() => {
  if (stepper.value?.hasNext) {
    return steps.value[selectedStep.value + 1]?.title;
  } else {
    return "$.btn.complete_order";
  }
});
const stepper = useTemplateRef("stepper");
const steps = ref([
  {
    slot: "cart",
    title: t("$.cart.title"),
    icon: "i-heroicons-shopping-cart",
    disabled: computed(() => !carts?.length),
  },
  {
    slot: "delivery_payment",
    title: t("$.cashdesk.delivery_payment"),
    icon: "i-heroicons-truck",
    disabled: computed(
      () => !carts?.length || !user?.valid || !delivery.valid || !payment.valid
    ),
  },
  {
    slot: "summary",
    title: t("$.cashdesk.summary"),
    icon: "i-heroicons-credit-card",
    disabled: computed(
      () => !carts?.length || !user?.valid || !delivery.valid || !payment.valid
    ),
  },
]);
const defaultIndex = steps.value.findIndex(
  (item) => item.title === route.query.step
);
const selectedStep = ref(defaultIndex > 0 ? defaultIndex : 0);

watch(selectedStep, () => {
  router.replace({
    query: { step: steps.value[selectedStep.value]?.title },
  });
});
</script>

<template>
  <div
    :id="(routes.cashdesk?.meta?.syscode as string)"
    class="max-w-7xl mx-auto px-5"
  >
    <UPageHeader
      :title="title"
      :ui="{ title: 'mx-auto text-primary-600 dark:text-white' }"
      class="border-none"
    />

    <UStepper
      ref="stepper"
      v-model="selectedStep"
      :items="steps"
      :linear="true"
    >
      <template #cart>
        <CmpCashdeskCart />
      </template>

      <template #delivery_payment>
        <CmpCashdeskDeliveryPayment />
      </template>

      <template #summary>
        <CmpCashdeskSummary />
      </template>
    </UStepper>

    <div class="flex justify-between mt-8">
      <UButton
        :to="stepper?.hasPrev ? undefined : routes.wine?.path"
        :color="stepper?.hasPrev ? 'primary' : 'secondary'"
        icon="i-heroicons-arrow-left"
        size="lg"
        variant="outline"
        @click="stepper?.hasPrev && stepper?.prev()"
      >
        <span class="hidden sm:block">
          {{ $tt(backBtn!) }}
        </span>
      </UButton>

      <UButton
        trailing-icon="i-heroicons-arrow-right-20-solid"
        :color="stepper?.hasNext ? 'primary' : 'secondary'"
        size="lg"
        :loading="loading"
        :disabled="steps[selectedStep]?.disabled"
        @click="stepper?.hasNext ? stepper?.next() : onSubmit()"
      >
        {{ $tt(nextBtn!) }}
      </UButton>
    </div>
  </div>
</template>
