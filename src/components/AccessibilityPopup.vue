<script setup lang="ts">
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
</style>
