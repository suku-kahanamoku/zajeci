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

const { carts, user, delivery, loading, onSubmit } = useCashdesk();

const stepper = useTemplateRef("stepper");

const steps = ref([
  {
    slot: "cart",
    title: t("$.cart.title"),
    icon: "i-heroicons-shopping-cart",
  },
  {
    slot: "delivery_payment",
    title: t("$.cashdesk.delivery_payment"),
    icon: "i-heroicons-truck",
  },
  {
    slot: "summary",
    title: t("$.cashdesk.summary"),
    icon: "i-heroicons-credit-card",
  },
]);

const stepModel = ref(
  steps.value.findIndex((item) => item.title === route.query.step) > 0
    ? steps.value.findIndex((item) => item.title === route.query.step)
    : 0
);

const validations = computed(() => [
  !!carts.value?.length,
  !!carts.value?.length && user.value?.valid && delivery.value.valid,
  !!carts.value?.length && user.value?.valid && delivery.value.valid,
]);

const backBtn = computed(() => {
  if (stepper.value?.hasPrev) {
    return steps.value[stepModel.value - 1]?.title;
  } else {
    return "$.btn.back_shopping";
  }
});

const nextBtn = computed(() => {
  if (stepper.value?.hasNext) {
    return steps.value[stepModel.value + 1]?.title;
  } else {
    return "$.btn.complete_order";
  }
});

watch(stepModel, (value, oldValue) => {
  if (value > oldValue) {
    if (!validations.value[oldValue]) {
      stepModel.value = oldValue;
      return;
    }
  }
  router.replace({
    query: { step: steps.value[stepModel.value]?.title },
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

    <div v-if="loading !== null">
      <UStepper ref="stepper" v-model="stepModel" :items="steps" :linear="true">
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
            {{ t(backBtn!) }}
          </span>
        </UButton>

        <UButton
          trailing-icon="i-heroicons-arrow-right-20-solid"
          :color="stepper?.hasNext ? 'primary' : 'secondary'"
          size="lg"
          :loading="(loading as boolean)"
          :disabled="!validations[stepModel]"
          @click="stepper?.hasNext ? stepper?.next() : onSubmit()"
        >
          {{ t(nextBtn!) }}
        </UButton>
      </div>
    </div>
  </div>
</template>
