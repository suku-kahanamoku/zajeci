<script setup lang="ts">
import { CLONE } from "@suku-kahanamoku/common-module/utils";
import { DeliveryServices } from "./modules/eshop-module/runtime/types/order.interface";

const {
  i18n: { locale },
} = useLang();
const auth = useAuthStore();
const cashdesk = useCashdeskStore();

onMounted(() => {
  setCashdesk();
});

watch(
  () => auth.loggedIn,
  (value, oldValue) => {
    // prihlaseni
    if (value === true && oldValue === false) {
      setCashdesk();
    }
    //
    else if (value === false && oldValue === true) {
      cashdesk.reset();
    }
  }
);

function setCashdesk() {
  if (auth.user) {
    // pokud neni vyplnena fakturacni adresa, doplni
    if (!cashdesk.user.valid) {
      cashdesk.setUser(auth.user);
    }
    // pokud neni vyplnena dodaci adresa, doplni
    if (
      !cashdesk.delivery.valid &&
      [DeliveryServices.free, DeliveryServices.post].includes(
        cashdesk.delivery.type
      )
    ) {
      cashdesk.delivery.address = CLONE(auth.user.address?.main);
    }
  }
}
</script>
<template>
  <UApp :locale="locale">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <CmpCookieBanner />
  </UApp>
</template>
