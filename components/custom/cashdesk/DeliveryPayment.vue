<script setup lang="ts">
const { $tt } = useNuxtApp();

const items = [
  {
    key: "anonymous",
    label: $tt("$.cashdesk.anonymous"),
  },
  {
    key: "login",
    label: $tt("$.navbar.login"),
  },
  {
    key: "signup",
    label: $tt("$.navbar.signup"),
  },
];

const selected = ref();
</script>
<template>
  <div>
    <UTabs v-if="!useAuthStore().loggedIn" v-model="selected" :items="items">
      <template #item="{ item }">
        <div class="flex items-center justify-center mx-auto w-full">
          <CustomFormLogin v-if="item.key === 'login'" />
          <CustomFormSignup v-else-if="item.key === 'signup'" />
          <CustomCashdeskContact v-else />
        </div>
      </template>
    </UTabs>
    <div v-else class="flex items-center justify-center mx-auto w-full">
      <CustomCashdeskContact />
    </div>
    <div
      class="flex flex-col md:flex-row items-stretch justify-between md:gap-8"
    >
      <CustomCashdeskDelivery />
      <CustomCashdeskPayment />
    </div>
  </div>
</template>
