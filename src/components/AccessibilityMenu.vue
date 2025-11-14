<script setup lang="ts">
import { useAccessibility } from '@/accessibility';
import IconAccessibility from '@/components/icons/IconAccessibility.vue';
import IconClose from '@/components/icons/IconClose.vue';
import InputSelect from '@/components/InputSelect.vue';
import { ref } from 'vue';
defineProps<{ labelHidden?: boolean }>();

const dialogElement = ref<HTMLDialogElement>();
const accessibility = useAccessibility();
</script>

<template>
  <button
    ref="accessibilityButton"
    class="button-outlined"
    aria-label="Accessibility"
    @click="dialogElement?.show()"
  >
    <IconAccessibility aria-hidden="true" /><span
      v-if="!labelHidden"
      aria-hidden="true"
      >Accessibility</span
    >
  </button>

  <teleport to="body">
    <dialog ref="dialogElement" closedby="any">
      <div class="header-row">
        <h2>Accessibility Options</h2>
        <button class="button-outlined" @click="dialogElement?.close()">
          <IconClose aria-label="Close" />
        </button>
      </div>
      <p>Here you can set your accessibility options.</p>
      <div class="accessibility-options">
        <InputSelect
          v-model="accessibility.fontSize"
          name="Text size"
          label="Text size"
          :options="[
            { text: 'Regular', value: 16 },
            { text: 'Large', value: 18 },
            { text: 'Extra large', value: 20 },
          ]"
        />
        <InputSelect
          v-model="accessibility.themeMode"
          name="Style"
          label="Theme"
          :options="[
            { text: 'Light', value: 'light' },
            { text: 'Dark', value: 'dark' },
            { text: 'System', value: 'light dark' },
          ]"
        />
        <div class="button-row">
          <button class="button-outlined" @click="accessibility.reset()">
            Reset
          </button>
        </div>
      </div>
    </dialog>
  </teleport>
</template>

<style scoped>
dialog {
  position: fixed;
  inset: 0 0 0 auto;
  height: 100%;
  width: min(100%, 40ch);
  z-index: 1000000000000;

  background-color: var(--dialog-bgcolor);
  color: var(--dialog-color);
  border: none;
  outline: 1px solid var(--dialog-border-color);
  box-shadow: var(--dialog-shadow);
}

.header-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;

  > h2 {
    margin-block: 0;
  }
}

.accessibility-options {
  display: grid;
  gap: 1rem;
}
</style>
