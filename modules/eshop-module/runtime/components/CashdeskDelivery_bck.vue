<script setup lang="ts">
import { object, string } from "yup";
import { useToNumber } from "@vueuse/core";
import { useDebounceFn } from "@vueuse/core";

import { DeliveryServices } from "@/modules/eshop-module/runtime/types/order.interface";

const { $tt } = useNuxtApp();
const {
  i18n: { locale },
} = useLang();
const auth = useAuthStore();
const cashdesk = useCashdeskStore();
const formEl = ref();

const schema = object({
  type: string().required(" "),
  address: object({
    name: string().required(" "),
    street: string().required(" "),
    city: string().required(" "),
    zip: string().required(" ").matches(/^\d+$/, $tt("$.message.invalid_zip")),
    state: string().required(" "),
  }).required(" "),
});

onMounted(checkValidation);

watch(cashdesk.delivery, useDebounceFn(checkValidation, 400));

async function checkValidation() {
  if (cashdesk.delivery) {
    cashdesk.delivery.totalPrice =
      cashdesk.deliveries[cashdesk.delivery.type]?.price || 0;
    try {
      await formEl.value.validate();
      cashdesk.delivery.valid = true;
    } catch (error) {
      cashdesk.delivery.valid = false;
    }
  }
}
</script>
<template>
  <UForm
    ref="formEl"
    :schema="schema"
    :state="cashdesk.delivery"
    class="w-full border rounded-lg shadow-md my-4 dark:border dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
      <UFormField name="type">
        <template #label>
          <h3
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
          >
            {{ $tt(cashdesk.fields.delivery.label) }}
          </h3>
        </template>
        <div class="pt-4">
          <URadio
            v-for="option of cashdesk.deliveryOptions"
            :key="option.value"
            v-model="cashdesk.delivery.type"
            :value="option.value"
            :disabled="option?.disabled"
          >
            <template #label>
              <div class="flex items-center justify-between w-full">
                <div class="flex items-center gap-2">
                  <Icon
                    v-if="option?.avatar?.startsWith('mdi:')"
                    :name="option.avatar"
                    size="30"
                    class="w-20"
                  />
                  <NuxtImg
                    v-else
                    :src="option?.avatar"
                    :alt="$tt(option?.label)"
                    loading="lazy"
                    format="webp"
                    width="80"
                    class="w-20"
                  />
                  <span>
                    {{ $tt(option?.label) }}
                  </span>
                  <UTooltip v-if="option?.help" :text="$tt(option.help)">
                    <Icon name="mdi:question-mark-circle" size="20" />
                  </UTooltip>
                </div>
                <span v-if="option.price! > 0">
                  {{
                    useToNumber(
                      option?.price?.toFixed(2) || 0
                    ).value.toLocaleString(locale)
                  }}&nbsp;{{ $tt("$.czk") }}
                </span>
                <span v-else>
                  {{ $tt("$.cashdesk.delivery.free") }}
                </span>
              </div>

              <!-- pokud je vybrana hodnota free (rozvoz po brne), tak zobrazi formular s dodaci adresou -->
              <!-- <div
								v-if="
									(option.value === DeliveryServices.free &&
										cashdesk.delivery.type === DeliveryServices.free) ||
									(option.value === DeliveryServices.post &&
										cashdesk.delivery.type === DeliveryServices.post)
								"
								class="space-y-4 my-4"
							> -->
              <div
                v-if="option.value === cashdesk.delivery.type"
                class="space-y-4 my-4"
              >
                <UFormField
                  :label="$tt(auth.fields.name.label)"
                  name="address.main.name"
                  required
                  class="w-full"
                >
                  <UInput
                    v-model="cashdesk.delivery.address!.name"
                    :placeholder="$tt(auth.fields.name.placeholder as string)"
                    :autocomplete="auth.fields.name.autocomplete"
                    size="lg"
                  />
                </UFormField>
                <div
                  class="flex flex-col sm:flex-row justify-between items-center gap-x-2 space-y-4 sm:space-y-0"
                >
                  <UFormField
                    :label="$tt(auth.fields.street.label)"
                    name="address.main.street"
                    required
                    class="w-full"
                  >
                    <UInput
                      v-model="cashdesk.delivery.address!.street"
                      :placeholder="$tt(auth.fields.street.placeholder as string)"
                      :autocomplete="auth.fields.street.autocomplete"
                      size="lg"
                    />
                  </UFormField>
                  <UFormField
                    :label="$tt(auth.fields.city.label)"
                    name="address.main.city"
                    required
                    class="w-full"
                  >
                    <UInput
                      v-model="cashdesk.delivery.address!.city"
                      :placeholder="$tt(auth.fields.city.placeholder as string)"
                      :autocomplete="auth.fields.city.autocomplete"
                      size="lg"
                    />
                  </UFormField>
                </div>

                <div
                  class="flex flex-col sm:flex-row justify-between items-center gap-x-2 space-y-4 sm:space-y-0"
                >
                  <UFormField
                    :label="$tt(auth.fields.zip.label)"
                    name="address.main.zip"
                    required
                    class="w-full"
                  >
                    <UInput
                      v-model="cashdesk.delivery.address!.zip"
                      :placeholder="$tt(auth.fields.zip.placeholder as string)"
                      :autocomplete="auth.fields.zip.autocomplete"
                      size="lg"
                    />
                  </UFormField>
                  <UFormField
                    :label="$tt(auth.fields.state.label)"
                    name="address.main.state"
                    required
                    class="w-full"
                  >
                    <USelectMenu
                      v-model="cashdesk.delivery.address!.state"
                      :options="
                        auth.stateOptions?.map((item) => ({
                          ...item,
                          ...{ label: $tt(item.label) },
                        }))
                      "
                      value-attribute="value"
                      option-attribute="label"
                      :placeholder="$tt(auth.fields.state.placeholder as string)"
                      :autocomplete="auth.fields.state.autocomplete"
                      size="lg"
                    />
                  </UFormField>
                </div>
              </div>
            </template>
          </URadio>
        </div>
      </UFormField>
    </div>
  </UForm>
</template>
