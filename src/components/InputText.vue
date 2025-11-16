<script setup lang="ts">
import { generateRandomId } from '@/utils';

// prettier-ignore
withDefaults(
  defineProps<{
    id?: string,
    type?: string,
    name: string,
    label: string,
  }>(),
  {
    id: () => `input-${generateRandomId()}`,
    type: 'text',
  }
);

const model = defineModel<string>();
</script>

<template>
  <div class="input-text">
    <label :for="id">{{ label }}</label>
    <input :id="id" v-model.lazy="model" :type="type" :name="name" />
  </div>
</template>

<style scoped>
.input-text {
  display: flex;
  flex-direction: column;
  background-color: var(--input-bgcolor);
  border: 1px solid var(--input-border-color);
  color: var(--input-color);
  border-radius: var(--input-border-radius);
  cursor: text;
  max-width: 60ch;

  > label {
    user-select: none;
    padding: var(--input-label-padding);
    font-size: var(--input-label-font-size);
    color: var(--input-label-color);
  }

  > input {
    padding: var(--input-field-padding);
    background: transparent;
    color: inherit;
    border: none;
    outline: none;
  }

  &:focus-within {
    border-color: var(--input-focus-border-color);
    outline: var(--input-focus-outline);
  }
}
</style>
