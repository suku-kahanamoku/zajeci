<script setup lang="ts">
const props = defineProps<{
  steps: any;
}>();
const model = defineModel<any>();
const stepper = useTemplateRef("stepper");

defineExpose(stepper);
</script>

<template>
  <UStepper ref="stepper" v-model="model" :items="steps" :linear="true">
    <template #cart>
      <CmpCashdeskCart />
    </template>

    <template #user>
      <CmpCashdeskUser />
    </template>

    <template #summary>
      <CmpCashdeskSummary />
    </template>
  </UStepper>
</template>
