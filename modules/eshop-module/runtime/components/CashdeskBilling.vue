<script setup lang="ts">
import { useUrlResolver, useAsyncData, useMenuItems } from "#imports";

import {
  CLONE,
  CONVERT_DOT_TO_OBJECT,
} from "@suku-kahanamoku/common-module/utils";
import type {
  IFormConfig,
  IFormField,
} from "@suku-kahanamoku/form-module/types";

import lConfig from "../assets/configs/billing.json";
import type { IItem } from "@suku-kahanamoku/common-module/types";

const { t } = useLang();
const { route } = useMenuItems();
const { updateConfig } = useUrlResolver();
const { user, setUser, delivery } = useCashdesk();
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
    data.user.valid = formCmp.value.form.getErrors().length ? false : true;
    setUser(data.user);
    //
    const name = event.srcElement.name;
    switch (name) {
      case "givenName":
      case "surname":
        if (
          !delivery.value.address?.name &&
          body["givenName"] &&
          body["surname"]
        ) {
          delivery.value.address!.name = `${body["givenName"]} ${body["surname"]}`;
          delivery.value.key!++;
        }
        break;

      case "address.main.street":
        if (!delivery.value.address?.street) {
          delivery.value.address!.street = body[name];
          delivery.value.key!++;
        }
        break;

      case "address.main.city":
        if (!delivery.value.address?.city) {
          delivery.value.address!.city = body[name];
          delivery.value.key!++;
        }
        break;

      case "address.main.zip":
        if (!delivery.value.address?.zip) {
          delivery.value.address!.zip = body[name];
          delivery.value.key!++;
        }
        break;

      case "address.main.state":
        if (!delivery.value.address?.state) {
          delivery.value.address!.state = body[name];
          delivery.value.key!++;
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
    :fields="config.fields"
    :item="(user as IItem)"
    variant="subtle"
    :actions="{ disabled: true }"
    :ui="{
      root: '',
      body: 'grid md:grid-cols-2 gap-4',
    }"
    @change="onChange"
  >
    <template #header>
      <h3
        class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
      >
        {{ t(config.title!) }}
      </h3>
    </template>
  </CmpForm>
</template>
