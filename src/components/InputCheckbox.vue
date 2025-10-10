<script setup lang="ts">
import { generateRandomId } from '@/utils';

// prettier-ignore
withDefaults(
  defineProps<{
    id?: string,
    name: string,
    label: string,
  }>(),
  {
    id: () => `input-${generateRandomId()}`,
  }
);

const model = defineModel<boolean>();
</script>

<template>
  <div class="input-checkbox">
    <input :id="id" v-model="model" type="checkbox" :name="name" />
    <label :for="id">{{ label }}</label>
  </div>
</template>

<style scoped>
.input-checkbox {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  user-select: none;
}
</style>
