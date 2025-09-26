<script setup lang="ts">
import { computed } from 'vue';

// prettier-ignore
const props = withDefaults(
  defineProps<{
    id?: string,
    type?: string,
    name: string,
    label: string,
  }>(),
  {
    id: undefined,
    type: 'text',
  }
);

const htmlId = computed(() => props.id ?? '');

const model = defineModel<string>();
</script>

<template>
  <div class="input-text">
    <label :for="htmlId">{{ label }}</label>
    <input :id="htmlId" v-model="model" :type="type" :name="name" />
  </div>
</template>

<style scoped></style>
