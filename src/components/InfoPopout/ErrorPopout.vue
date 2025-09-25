<template>
  <dev class="error-popout">
    <h1>{{ message }}</h1>
  </dev>
</template>
<script setup lang="ts">
const message = 'This is the error Popout component.';
</script>
<style lang="css">
.error-popout {
  border: 2px solid red;
  padding: 1rem;
  background-color: #ffe6e6;
  color: #a70000;
  border-radius: 8px;
}
</style>
