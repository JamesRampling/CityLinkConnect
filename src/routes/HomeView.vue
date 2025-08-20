<script setup lang="ts">
import ApiNumber from '@/components/ApiNumber.vue';
</script>

<template>
  <h1>Hello, World!</h1>

  <div>
    <suspense>
      <ApiNumber />
      <template #fallback>loading... </template>
    </suspense>
  </div>
</template>

<style scoped></style>
