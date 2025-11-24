<script setup lang="ts">
import z from 'zod';

defineProps<{ error: z.ZodError }>();
</script>

<template>
  <h2 class="title error"><slot name="title">Validation Error</slot></h2>
  <div v-for="issue in error.issues" :key="issue.message" class="error issue">
    <p class="error">{{ issue.message }}</p>
    <p v-for="p in issue.path" :key="p" class="error">{{ p }}</p>
  </div>
</template>

<style scoped>
.error {
  color: var(--error-color);

  p:not(:last-child) {
    margin-block-end: 0.5rem;
  }
}
</style>
