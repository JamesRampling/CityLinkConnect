<script setup lang="ts">
import ApiNumber from '@/components/ApiNumber.vue';
</script>

<template>
  <h1>Hello, World!</h1>

  <div>
    Here's a number:
    <suspense>
      <ApiNumber />
      <template #fallback>loading... </template>
    </suspense>
  </div>
</template>

<style scoped></style>
