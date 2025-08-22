<script setup lang="ts">
import UserWelcome from '@/components/UserWelcome.vue';
</script>

<template>
  <h1>Hello, World!</h1>

  <div>
    <suspense>
      <UserWelcome />
      <template #fallback>loading... </template>
    </suspense>
  </div>
</template>

<style scoped></style>
