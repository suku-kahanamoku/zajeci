<script setup lang="ts">
const { t } = useLang();
const { loggedIn } = useUserSession();

const items = [
  {
    key: "anonymous",
    label: t("$.cashdesk.anonymous"),
  },
  {
    key: "login",
    label: t("$.navbar.login"),
  },
  {
    key: "signup",
    label: t("$.navbar.signup"),
  },
];

const selected = ref();
</script>
<template>
  <div>
    <div
      v-if="loggedIn"
      class="flex items-center justify-center mx-auto w-full"
    >
      <div class="w-full flex flex-col gap-8">
        <CmpCashdeskBilling />
        <div
          class="flex flex-col lg:flex-row items-stretch justify-between gap-8"
        >
          <CmpCashdeskDelivery />
          <CmpCashdeskPayment />
        </div>
      </div>
    </div>

    <UTabs v-else v-model="selected" :items="items">
      <template #content="{ item }">
        <div class="flex items-center justify-center mx-auto w-full">
          <CmpLogin v-if="item.key === 'login'" />
          <CmpSignup v-else-if="item.key === 'signup'" />
          <div v-else class="w-full flex flex-col gap-8">
            <CmpCashdeskBilling />
            <div
              class="flex flex-col lg:flex-row items-stretch justify-between gap-8"
            >
              <CmpCashdeskDelivery />
              <CmpCashdeskPayment />
            </div>
          </div>
        </div>
      </template>
    </UTabs>
  </div>
</template>
