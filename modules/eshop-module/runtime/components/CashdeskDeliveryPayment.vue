<script setup lang="ts">
const { $tt } = useNuxtApp();
const auth = useAuthStore();

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
    <UTabs v-if="!auth.loggedIn" v-model="selected" :items="items">
      <template #content="{ item }">
        <div class="flex items-center justify-center mx-auto w-full">
          <CmpLogin v-if="item.key === 'login'" />
          <CmpSignup v-else-if="item.key === 'signup'" />
          <CmpCashdeskBilling v-else />
        </div>
      </template>
    </UTabs>
    <div v-else class="flex items-center justify-center mx-auto w-full">
      <CmpCashdeskBilling />
    </div>
    <div
      class="flex flex-col md:flex-row items-stretch justify-between md:gap-8"
    >
      <CmpCashdeskDelivery />
      <CmpCashdeskPayment />
    </div>
  </div>
</template>
