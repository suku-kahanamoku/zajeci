<script setup lang="ts">
const { $tt } = useNuxtApp();
const { loggedIn } = useAuthStore();

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
  <div class="flex flex-col gap-8">
    <div
      v-if="loggedIn"
      class="flex items-center justify-center mx-auto w-full"
    >
      <CmpCashdeskBilling />
    </div>
    <UTabs v-else v-model="selected" :items="items">
      <template #content="{ item }">
        <div class="flex items-center justify-center mx-auto w-full">
          <CmpLogin v-if="item.key === 'login'" />
          <CmpSignup v-else-if="item.key === 'signup'" />
          <CmpCashdeskBilling v-else />
        </div>
      </template>
    </UTabs>
    <div class="flex flex-col md:flex-row items-stretch justify-between gap-8">
      <CmpCashdeskDelivery />
      <CmpCashdeskPayment />
    </div>
  </div>
</template>
