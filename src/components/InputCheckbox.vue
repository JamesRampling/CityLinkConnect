<script setup lang="ts">
import { computed } from 'vue';

// prettier-ignore
const props = withDefaults(
  defineProps<{
    id?: string,
    name: string,
    label: string,
  }>(),
  {
    id: undefined,
  }
);

const htmlId = computed(() => props.id ?? '');

const model = defineModel<boolean>();
</script>

<template>
  <div class="input-checkbox">
    <input :id="htmlId" v-model="model" type="checkbox" :name="name" />
    <label :for="htmlId">{{ label }}</label>
  </div>
</template>

<style scoped></style>
