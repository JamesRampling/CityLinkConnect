<script setup lang="ts">
import { useAccessibility } from '@/accessibility';
import InputSelect from '@/components/InputSelect.vue';
import { ref } from 'vue';
defineProps<{ target?: HTMLElement }>();

const dialogElement = ref<HTMLDialogElement>();

function show() {
  dialogElement.value?.show();
}

defineExpose({ show });

const accessibility = useAccessibility();
</script>

<template>
  <dialog ref="dialogElement" closedby="any">
    <h2>Accessibility Options</h2>
    <p>Here you can set your accessibility options.</p>
    <div id="options">
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
    </div>
    <div id="options">
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
    </div>
    <button class="button-outlined" @click="accessibility.reset()">
      Reset
    </button>
  </dialog>
</template>

<style scoped>
dialog {
  position: fixed;
  inset: 0 0 0 auto;
  height: 100%;
  width: min(100%, 40ch);
  z-index: 1000000000000;
}

#options {
  margin-bottom: 1rem;
}
</style>
