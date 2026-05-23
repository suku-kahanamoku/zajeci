<script setup lang="ts">
</script>
<template>
  <div class="flex items-center justify-center mx-auto w-full">
    <div class="w-full flex flex-col gap-8">
      <CmpCashdeskBilling />
      <div
        class="flex flex-col lg:flex-row items-stretch justify-between gap-8"
      >
        <CmpCashdeskShipping />
        <CmpCashdeskPayment />
      </div>
    </div>
  </div>
</template>
