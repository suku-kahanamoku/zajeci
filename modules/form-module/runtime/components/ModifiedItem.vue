<script lang="ts" setup>
import {
  useModifiedItemStore,
  onUnmounted,
  computed,
  useLocalePath,
} from "#imports";

const props = defineProps<{
  modelType?: string;
}>();

const localePath = useLocalePath();
const modifiedStore = useModifiedItemStore();
const modifiedItem = computed(() => modifiedStore.getItem(props.modelType!));

onUnmounted(() => modifiedStore.deleteItem(props.modelType!));
</script>

<template>
  <UAlert
    v-if="modelType && modifiedItem"
    icon="i-heroicons-exclamation-circle"
    color="success"
    variant="subtle"
    class="text-left"
  >
    <template #title>
      <span>{{
        $tt(
          modifiedItem.method === "POST"
            ? "$.info.created_item"
            : "$.info.modified_item"
        )
      }}</span
      >:&nbsp;<ULink
        v-if="modifiedItem.item?.gen_data?.url"
        :to="localePath(modifiedItem.item?.gen_data?.url)"
        class="hover:underline"
      >
        {{ modifiedItem.item?.gen_data?.name }}
      </ULink>
      <span v-else>{{ modifiedItem.item?.gen_data?.name }}</span>
    </template>
  </UAlert>
</template>
