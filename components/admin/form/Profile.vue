<script setup lang="ts">
import { object, string, boolean, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import type { UserDocument } from "@/server/types/user.type";

const { $tt } = useNuxtApp();
const toast = useToast();

const schema = object({
  email: string().email($tt("$.message.invalid_email")).required(" "),
  givenName: string(),
  surname: string(),
  role: string(),
  password: string().min(8, $tt("$.message.password_min", { count: 8 })),
  newPassword: string().min(8, $tt("$.message.password_min", { count: 8 })),
  newsletter: boolean(),
});

type Schema = InferType<typeof schema>;

const { user, roles, roleOptions, fields, isAdmin } = useAuthStore();

const state: Ref<UserDocument | any> = ref({
  _id: "",
  email: "",
  givenName: "",
  surname: "",
  role: "guest",
  password: "",
  newPassword: "",
  newsletter: true,
});

const loading = ref();

onMounted(async () => {
  const data = (await $fetch(`/api/admin/user/${user?._id}`, {
    method: "GET",
  })) as unknown as UserDocument;
  if (data) {
    state.value = data;
  }
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true;
  try {
    await $fetch(`/api/admin/user/${user?._id}`, {
      method: "PATCH",
      body: event.data,
    });
    toast.add({
      title: $tt("$.profile.success_msg"),
      color: "success",
      icon: "i-heroicons-check",
    });
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
    class="w-full border rounded-lg shadow-md md:mt-0 sm:max-w-xl xl:p-0 dark:border dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
      <h1
        class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
      >
        {{ $tt("$.profile.title") }}
      </h1>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4 md:space-y-6"
        @submit="onSubmit"
      >
        <UFormGroup :label="$tt(fields.email.label)" name="email" required>
          <UInput
            v-model="state.email"
            type="email"
            :placeholder="fields.email.placeholder"
            required
            size="lg"
            readonly
          />
        </UFormGroup>

        <div class="flex justify-between items-center gap-x-2">
          <UFormGroup :label="$tt(fields.givenName.label)" name="givenName">
            <UInput
              v-model="state.givenName"
              :placeholder="$tt(fields.givenName.placeholder as string)"
              size="lg"
            />
          </UFormGroup>
          <UFormGroup :label="$tt(fields.surname.label)" name="surname">
            <UInput
              v-model="state.surname"
              :placeholder="$tt(fields.surname.placeholder as string)"
              size="lg"
            />
          </UFormGroup>
        </div>

        <UFormGroup v-if="isAdmin" :label="$tt(fields.role.label)" name="role">
          <USelectMenu
            v-model="state.role"
            :options="roleOptions"
            value-attribute="value"
            option-attribute="label"
            :placeholder="fields.role.placeholder"
            size="lg"
          >
            <template #label>
              {{ $tt(roles[state.role as any]?.label) }}
            </template>

            <template #option="{ option }">
              {{ $tt(option.label) }}
            </template>
          </USelectMenu>
        </UFormGroup>

        <div class="flex justify-between items-center gap-x-2">
          <UFormGroup :label="$tt(fields.password.label)" name="password">
            <UInput
              v-model="state.password"
              type="password"
              :placeholder="fields.password.placeholder"
              size="lg"
            />
          </UFormGroup>
          <UFormGroup
            :label="$tt('$.profile.change_password')"
            name="newPassword"
          >
            <UInput
              v-model="state.newPassword"
              type="password"
              :placeholder="fields.password.placeholder"
              size="lg"
              autocomplete="new-password"
            />
          </UFormGroup>
        </div>

        <UCheckbox
          v-model="state.newsletter"
          name="newsletter"
          :label="$tt(fields.newsletter.label)"
          :loading="loading"
        />

        <UButton type="submit" size="lg" block class="dark:text-white">
          {{ $tt("$.btn.submit") }}
        </UButton>
      </UForm>
    </div>
  </div>
</template>
