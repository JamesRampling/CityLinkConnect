<template>
  <dev class="warning-popout">
    <h1>{{ message }}</h1>
  </dev>
</template>
<script setup lang="ts">
const message = 'This is the Warning Popout component.';
</script>
<style lang="css">
.warning-popout {
  border: 2px solid rgb(255, 255, 0);
  padding: 1rem;
  background-color: #ffe6e6;
  color: #42ad03;
  border-radius: 8px;
}
</style>
