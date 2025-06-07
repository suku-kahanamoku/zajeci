<script setup lang="ts">
definePageMeta({
  layout: "default",
  syscode: "cashdesk",
  title: "$.cashdesk.title",
});

const { $tt } = useNuxtApp();

useHead({
  title: `${$tt("$.base.title")} | ${$tt("$.cashdesk.title")}`,
  meta: [
    { name: "description", content: $tt("$.base.description") },
    { name: "keywords", content: $tt("$.base.description") },
  ],
});

const cashdesk = useCashdeskStore();

const route = useRoute();
const router = useRouter();
const { routes } = useMenuItems();
const stepper = useTemplateRef("stepper");

const steps = ref([
  {
    slot: "cart",
    title: $tt("$.cashdesk.cart.title"),
    icon: "i-heroicons-shopping-cart",
  },
  {
    slot: "delivery_payment",
    title: $tt("$.cashdesk.delivery_payment"),
    icon: "i-heroicons-truck",
    disabled: computed(() => !cashdesk.carts?.length),
  },
  {
    slot: "summary",
    title: $tt("$.cashdesk.summary"),
    icon: "i-heroicons-credit-card",
    disabled: computed(
      () =>
        !cashdesk.carts?.length ||
        !cashdesk.user?.valid ||
        !cashdesk.delivery.valid ||
        !cashdesk.payment.valid
    ),
  },
]);

const defaultIndex = steps.value.findIndex(
  (item) => item.title === route.query.step
);
const selectedStep = ref(defaultIndex > 0 ? defaultIndex : 0);
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

watch(selectedStep, () => {
  router.replace({
    query: { step: steps.value[selectedStep.value].title },
  });
});
</script>

<template>
  <div class="max-w-screen-xl mx-auto px-5 w-full">
    <div id="cashdesk" class="py-10">
      <h1
        class="text-center text-primary-600 text-4xl lg:text-5xl font-bold tracking-tight dark:text-primary-400"
      >
        {{ $tt("$.cashdesk.title") }}
      </h1>
      <div class="py-10">
        <UStepper ref="stepper" v-model="selectedStep" :items="steps">
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
            :to="stepper?.hasPrev ? undefined : routes.wine.path"
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
            :disabled="!stepper?.hasNext"
            :loading="cashdesk.loading"
            @click="stepper?.hasNext ? stepper?.next() : cashdesk.onSubmit()"
          >
            {{ $tt(nextBtn!) }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
