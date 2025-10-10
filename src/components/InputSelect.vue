<script setup lang="ts" generic="T">
import { generateRandomId } from '@/utils';

// prettier-ignore
withDefaults(
  defineProps<{
    id?: string,
    name: string,
    label: string,
    options?: InputSelectOption[],
  }>(),
  {
    id: () => `select-${generateRandomId()}`,
    options: () => [],
  }
);

interface InputSelectOption {
  id?: string;
  text?: string;
  value?: T;
}

const model = defineModel<T>();
</script>

<template>
  <div class="input-select">
    <label :for="id">{{ label }}</label>
    <select :id="id" v-model="model" :name="name">
      <option :value="undefined">None</option>
      <option v-for="opt in options" :key="opt.id" :value="opt.value">
        {{ opt.text ?? opt.value }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.input-select {
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

  > select {
    padding: var(--input-field-padding);
    background: transparent;
    color: inherit;
    border: none;
    outline: none;

    > option {
      background-color: var(--input-bgcolor);
    }
  }

  &:focus-within {
    border-color: var(--input-focus-border-color);
    outline: var(--input-focus-outline);
  }
}
</style>
