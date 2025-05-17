<script setup lang="ts">
import { object, string, boolean, ref as yupRef, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";

const { $tt } = useNuxtApp();
const { routes } = useMenuItems();
const toast = useToast();
const auth = useAuthStore();
const localePath = useLocalePath();

const schema = object({
  email: string().email($tt("$.message.invalid_email")).required(" "),
  password: string()
    .required(" ")
    .min(8, $tt("$.message.password_min", { count: 8 })),
  confirmPassword: string()
    .required(" ")
    .oneOf([yupRef("password")], $tt("$.message.password_not_match")),
  terms: boolean().required(" "),
});

type Schema = InferType<typeof schema>;

const state = reactive({
  email: undefined,
  password: undefined,
  confirmPassword: undefined,
  terms: undefined,
});

const loading = ref();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true;
  try {
    await auth.signup(event.data);
  } catch (error: any) {
    toast.add({
      title: error.data.message,
      color: "error",
      icon: "i-heroicons-exclamation-circle",
    });
  }
  loading.value = false;
}
</script>
<template>
  <div
    class="w-full border rounded-lg shadow-md max-w-md my-4 dark:border dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
      <h1
        class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
      >
        {{ $tt("$.signup.title") }}
      </h1>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4 md:space-y-6"
        @submit="onSubmit"
      >
        <UFormField :label="$tt(auth.fields.email.label)" name="email" required>
          <UInput
            v-model="state.email"
            type="email"
            :placeholder="auth.fields.email.placeholder"
            required
            size="lg"
          />
        </UFormField>
        <UFormField
          :label="$tt(auth.fields.password.label)"
          name="password"
          required
        >
          <UInput
            v-model="state.password"
            type="password"
            :placeholder="auth.fields.password.placeholder"
            required
            size="lg"
            autocomplete="new-password"
          />
        </UFormField>
        <UFormField
          :label="$tt('$.signup.confirm_password')"
          name="confirmPassword"
          required
        >
          <UInput
            v-model="state.confirmPassword"
            type="password"
            :placeholder="auth.fields.password.placeholder"
            required
            size="lg"
          />
        </UFormField>
        <UFormField
          name="terms"
          :error="state.terms === false ? true : undefined"
          class="flex items-center"
        >
          <template #default="{ error }">
            <UCheckbox
              v-model="state.terms"
              :ui="{
                ring:
                  error &&
                  'ring ring-inset ring-error-500 dark:ring-error-400 focus:ring-2 focus:ring-error-500 dark:focus:ring-error-400',
              }"
            >
              <template #label>
                <span>
                  {{ $tt(auth.fields.terms.label) }}
                </span>
                &nbsp;
                <UButton
                  :to="localePath(routes.terms_conditions?.path)"
                  class="text-primary-500 dark:text-white"
                  variant="link"
                  size="sm"
                  :padded="false"
                  >{{ $tt(routes.terms_conditions?.meta?.title as string) }}</UButton
                >
              </template>
            </UCheckbox>
          </template>
        </UFormField>
        <UButton
          type="submit"
          size="lg"
          block
          :loading="loading"
          class="dark:text-white"
        >
          {{ $tt("$.signup.title") }}
        </UButton>
        <p class="text-sm font-light text-gray-500 dark:text-gray-400">
          {{ $tt("$.signup.has_account") }}
          <UButton
            :to="localePath(routes.login?.path)"
            class="font-medium text-primary-500 dark:text-white"
            variant="link"
            size="sm"
            :padded="false"
            >{{ $tt(routes.login?.meta?.title as string) }}</UButton
          >
        </p>
      </UForm>
    </div>
  </div>
</template>
