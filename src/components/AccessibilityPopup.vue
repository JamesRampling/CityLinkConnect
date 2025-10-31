<script setup lang="ts">
import InputSelect from '@/components/InputSelect.vue';
import { ref } from 'vue';
defineProps<{ target?: HTMLElement }>();

const dialogElement = ref<HTMLDialogElement>();

function show() {
  dialogElement.value?.show();
}

defineExpose({ show });
</script>

<template>
  <dialog ref="dialogElement" closedby="any">
    <h2>Accessibility Options</h2>
    <p>Here you can set your accessibility options.</p>
    <div id="options">
      <InputSelect
        name="Text size"
        label="Text size"
        :options="[
          { text: 'Small', value: 'small' },
          { text: 'Medium', value: 'medium' },
          { text: 'Large', value: 'large' },
        ]"
      />
    </div>
    <div id="options">
      <InputSelect
        name="Style"
        label="Mode"
        :options="[
          { text: 'Normal', value: 'normal' },
          { text: 'Dark mode', value: 'black' },
        ]"
      />
    </div>
    <button class="button-outlined">Reset</button>
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
