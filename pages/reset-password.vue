<script setup lang="ts">
const route = useRoute();
const password = ref("");
const passwordAgain = ref("");
const loading = ref(false);
const success = ref(false);
const errorMessage = ref("");

useSeoMeta({ robots: "noindex, nofollow" });
useHead({ title: "Nastavení nového hesla" });

async function submit() {
  errorMessage.value = "";
  if (password.value.length < 8) {
    errorMessage.value = "Heslo musí mít alespoň 8 znaků.";
    return;
  }
  if (password.value !== passwordAgain.value) {
    errorMessage.value = "Zadaná hesla se neshodují.";
    return;
  }

  loading.value = true;
  try {
    await $fetch("/api/auth/complete-reset", {
      method: "POST",
      body: { token: route.query.token, new_password: password.value },
    });
    success.value = true;
  } catch (error: any) {
    errorMessage.value =
      error?.data?.message || "Odkaz je neplatný nebo už vypršel.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="mx-auto mt-10 w-full max-w-md rounded-2xl bg-white p-6 shadow">
    <h1 class="mb-5 text-2xl font-semibold">Nastavení nového hesla</h1>

    <div v-if="success" class="space-y-4">
      <p>Heslo bylo změněno. Nyní se můžete přihlásit.</p>
      <UButton to="/login" block>Přejít na přihlášení</UButton>
    </div>

    <form v-else class="space-y-4" @submit.prevent="submit">
      <label class="block">
        <span class="mb-1 block text-sm font-medium">Nové heslo</span>
        <UInput v-model="password" type="password" autocomplete="new-password" required />
      </label>
      <label class="block">
        <span class="mb-1 block text-sm font-medium">Nové heslo znovu</span>
        <UInput v-model="passwordAgain" type="password" autocomplete="new-password" required />
      </label>
      <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>
      <UButton type="submit" block :loading="loading">Uložit nové heslo</UButton>
    </form>
  </div>
</template>
