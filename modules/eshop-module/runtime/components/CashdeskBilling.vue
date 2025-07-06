<script setup lang="ts">
import { useUrlResolver, useAsyncData, useMenuItems } from "#imports";
import defu from "defu";

import {
  CLONE,
  CONVERT_DOT_TO_OBJECT,
} from "@suku-kahanamoku/common-module/utils";
import type { IFormConfig } from "@/modules/form-module/runtime/types/form.interface";
import type { IFormField } from "@/modules/form-module/runtime/types/field.interface";

import lConfig from "../assets/configs/billing.json";

const { route } = useMenuItems();
const { updateConfig } = useUrlResolver();
const cashdesk = useCashdeskStore();
const formCmp = ref();

/**
 * Load config
 */
const { data: config } = await useAsyncData(
  async () => {
    try {
      const result = CLONE(lConfig);
      updateConfig(route, result);
      return result as IFormConfig;
    } catch (error: any) {
      return {} as IFormConfig;
    }
  },
  { watch: [() => route.query] }
);

function onChange(body: Record<string, any>, event: any) {
  if (config.value) {
    const data = CLONE(body);
    CONVERT_DOT_TO_OBJECT(data);
    cashdesk.setUser(defu(data.user, cashdesk.user));
    //
    const name = event.srcElement.name;
    switch (name) {
      case "user.givenName":
      case "user.surname":
        if (
          !cashdesk.delivery.address!.name &&
          body["user.givenName"] &&
          body["user.surname"]
        ) {
          cashdesk.delivery.address!.name = `${body["user.givenName"]} ${body["user.surname"]}`;
          cashdesk.delivery.key!++;
        }
        break;

      case "user.address.main.street":
        if (!cashdesk.delivery.address!.street) {
          cashdesk.delivery.address!.street = body[name];
          cashdesk.delivery.key!++;
        }
        break;

      case "user.address.main.city":
        if (!cashdesk.delivery.address!.city) {
          cashdesk.delivery.address!.city = body[name];
          cashdesk.delivery.key!++;
        }
        break;

      case "user.address.main.zip":
        if (!cashdesk.delivery.address!.zip) {
          cashdesk.delivery.address!.zip = body[name];
          cashdesk.delivery.key!++;
        }
        break;

      case "user.address.main.state":
        if (!cashdesk.delivery.address!.state) {
          cashdesk.delivery.address!.state = body[name];
          cashdesk.delivery.key!++;
        }
        break;
    }
  }
}
</script>
<template>
  <CmpForm
    v-if="config"
    ref="formCmp"
    :fields="(config.fields as IFormField[])"
    :item="(cashdesk as any)"
    variant="subtle"
    :actions="{ disabled: true }"
    :ui="{
      root: '',
      body: 'grid md:grid-cols-2 gap-4',
    }"
    class="w-full"
    @change="onChange"
  >
    <template #header>
      <h3
        class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
      >
        {{ $tt(config.title!) }}
      </h3>
    </template>
  </CmpForm>
</template>
