<script setup lang="ts">
import { CLONE } from "@suku-kahanamoku/common-module/utils";
import { DeliveryServices } from "./modules/eshop-module/runtime/types/order.interface";

const {
  i18n: { locale },
} = useLang();
const {
  user: cashdeskUser,
  delivery: cashdeskDelivery,
  reset: cashdeskReset,
  setUser: cashdeskSetUser,
} = useCashdesk();
const { loggedIn, user } = useUserSession();

onMounted(() => {
  setCashdesk();
});

watch(loggedIn, (value, oldValue) => {
  // prihlaseni
  if (value === true && oldValue === false) {
    setCashdesk();
  }
  //
  else if (value === false && oldValue === true) {
    cashdeskReset();
  }
});

function setCashdesk() {
  if (user.value) {
    // pokud neni vyplnena fakturacni adresa, doplni
    if (!cashdeskUser.value?.valid) {
      cashdeskSetUser(user.value);
    }
    // pokud neni vyplnena dodaci adresa, doplni
    if (
      !cashdeskDelivery.value?.valid &&
      [DeliveryServices.free, DeliveryServices.post].includes(
        cashdeskDelivery.value.type
      )
    ) {
      cashdeskDelivery.value.address = CLONE(user.value.address?.main);
    }
  }
}
</script>
<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UiCookieBanner />
  </UApp>
</template>
