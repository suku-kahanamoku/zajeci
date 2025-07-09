<script lang="ts" setup>
import { ref } from "vue";
import { useLang, useField, useToastify } from "#imports";
import { useClipboard } from "@vueuse/core";

import type { IItem } from "@suku-kahanamoku/common-module/types";

import type { IFormConfig } from "../types/form.interface";

const props = defineProps<{
  config: IFormConfig | null;
  item?: IItem;
}>();

const { lang } = useLang();
const { getResolvedValue } = useField();
const { copy } = useClipboard({ legacy: true });
const { display } = useToastify();
const el = ref();

/**
 * Zkopiruje do schranky a zobrazi toast s upozornenim
 */
async function onCopy() {
  await copy(el.value.innerText);
  display({
    type: "success",
    message: "$.info.copied",
    options: {
      timeout: 2000,
    },
  });
}
</script>

<template>
  <CmpTooltip>
    <UButton
      data-testid="info-btn"
      icon="i-heroicons-information-circle"
      variant="ghost"
      size="xl"
      class="px-1 py-1"
      @click="onCopy"
    />

    <template #text>
      <div ref="el">
        <div v-for="field in config?.infoFields" class="grid grid-cols-2 my-1">
          <div>
            <h4>{{ $tt(field?.label!) }}:</h4>
          </div>
          <div v-if="item">
            {{ $tt(getResolvedValue(item, field, lang.code)) }}
          </div>
        </div>
      </div>
    </template>
  </CmpTooltip>
</template>
