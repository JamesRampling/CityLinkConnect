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
    id: () => `textarea-${generateRandomId()}`,
  }
);

const model = defineModel<string>();

function setTextAreaHeight(textarea: unknown) {
  if (textarea instanceof HTMLTextAreaElement) {
    requestAnimationFrame(() => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
  }
}
</script>

<template>
  <div class="input-textarea">
    <label :for="id">{{ label }}</label>
    <textarea
      :id="id"
      :ref="setTextAreaHeight"
      v-model.lazy="model"
      :name="name"
      rows="4"
      @input="setTextAreaHeight($event.target)"
    />
  </div>
</template>

<style scoped>
.input-textarea {
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

  > textarea {
    padding: var(--input-field-padding);
    background: transparent;
    color: inherit;
    border: none;
    outline: none;
    resize: none;
  }

  &:focus-within {
    border-color: var(--input-focus-border-color);
    outline: var(--input-focus-outline);
  }
}
</style>
