<template>
  <dev class="info-popout">
    <h1>{{ message }}</h1>
  </dev>
</template>
<script setup lang="ts">
const message = 'This is the info Popout component.';
</script>
<style lang="css">
.warning-popout {
  border: 2px solid rgb(34, 0, 255);
  padding: 1rem;
  background-color: #ffe6e6;
  color: #026ad1;
  border-radius: 8px;
}
</style>
