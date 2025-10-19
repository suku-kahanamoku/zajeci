<script setup lang="ts">
import { CLONE } from "@suku-kahanamoku/common-module/utils";
import { DeliveryServices } from "./modules/eshop-module/runtime/types/order.interface";

const {
  i18n: { locale },
} = useLang();
const cashdesk = useCashdeskStore();
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
    cashdesk.reset();
  }
});

function setCashdesk() {
  if (user.value) {
    // pokud neni vyplnena fakturacni adresa, doplni
    if (!cashdesk.user.valid) {
      cashdesk.setUser(user.value);
    }
    // pokud neni vyplnena dodaci adresa, doplni
    if (
      !cashdesk.delivery.valid &&
      [DeliveryServices.free, DeliveryServices.post].includes(
        cashdesk.delivery.type
      )
    ) {
      cashdesk.delivery.address = CLONE(user.value.address?.main);
    }
  }
}
</script>
<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <CmpCookieBanner />
  </UApp>
</template>
