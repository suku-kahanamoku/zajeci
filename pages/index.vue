<script setup lang="ts">
definePageMeta({
  syscode: "home",
  title: "$.base.title",
});

const { t } = useLang();
const { routes, route } = useMenuItems();
const title = computed(() => t(route.meta.title as string));
const promotionDialogOpen = ref(false);

const promotionSessionKey = "homepage-promotion-2026-08-26-closed";

onMounted(() => {
  try {
    promotionDialogOpen.value =
      sessionStorage.getItem(promotionSessionKey) !== "true";
  } catch {
    promotionDialogOpen.value = true;
  }
});

watch(promotionDialogOpen, (isOpen, wasOpen) => {
  if (isOpen || !wasOpen) return;

  try {
    sessionStorage.setItem(promotionSessionKey, "true");
  } catch {
    // The dialog can still be closed when session storage is unavailable.
  }
});

useHead({
  title,
  meta: [
    { name: "description", content: t("$.base.description") },
    { name: "keywords", content: t("$.base.description") },
  ],
});
</script>

<template>
  <div class="w-full overflow-hidden">
    <UModal
      v-model:open="promotionDialogOpen"
      title="Zaječská letošní vína 2026"
      :ui="{
        content: 'w-auto max-w-[min(90vw,40rem)]',
        body: 'p-0 sm:p-0',
      }"
    >
      <template #body>
        <NuxtImg
          src="/img/2026-08-26.jpeg"
          alt="Pozvánka na Zaječská letošní vína 2026"
          width="1276"
          height="1595"
          class="block max-h-[80vh] w-auto max-w-full object-contain"
        />
      </template>
    </UModal>

    <CustomIntro />

    <div class="w-full max-w-7xl mx-auto px-5 space-y-10 py-10">
      <CustomAbout />
      <CmpWineListTop />
      <CustomTasting />
      <CustomContact />
    </div>

    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1133.8470187599103!2d16.77301701287706!3d48.872071975484374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4712d1808ab9b27b%3A0x56188032580edada!2zxaBrb2xuw60gMTU2LCA2OTEgMDUgWmFqZcSNw60!5e0!3m2!1scs!2scz!4v1715605676127!5m2!1scs!2scz"
      width="100%"
      height="600"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      title="Mapa - Zaječské vinařství Nová Hora"
    ></iframe>
  </div>
</template>
