<script setup lang="ts">
const { payment, paymentOptions, setPayment } = useCashdesk();
const { t } = useLang();

watch(
  () => payment.value.value,
  (val) => {
    setPayment(paymentOptions.value.find((d) => d.value === val));
  }
);
</script>
<template>
  <UCard variant="subtle" class="w-full">
    <template #header>
      <h3
        class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
      >
        {{ t("$.payment.title") }}
      </h3>
    </template>

    <URadioGroup
      v-model="payment.value"
      :items="paymentOptions"
      :ui="{ item: 'items-center' }"
    >
      <template #label="{ item }">
        <div
          class="flex items-center justify-between w-full"
          :class="
            item.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          "
        >
          <div class="flex items-center gap-2">
            <UIcon :name="item.icon as string" size="30" class="w-20" />
            <span>
              {{ item?.label }}
            </span>
          </div>

          <CmpPrice v-if="item.price! > 0" :price="item?.price!" />
          <span v-else>
            {{ t("$.btn.free") }}
          </span>
        </div>
      </template>
    </URadioGroup>
  </UCard>
</template>
