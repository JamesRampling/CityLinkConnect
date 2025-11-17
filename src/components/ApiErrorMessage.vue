<script setup lang="ts" generic="T extends z.ZodType">
import type { FetchError } from '@/api/apiFetch';
import type z from 'zod';

defineProps<{ error: FetchError<T> }>();
</script>

<template>
  <div class="error-wrapper">
    <div class="error">
      <template v-if="error.type === 'not-found'">
        <h2 class="error-title">404 &mdash; {{ error.title }}</h2>
      </template>
      <template v-else-if="error.type === 'server-error'">
        <h2 class="error-title">{{ error.title }}</h2>
        <p class="error-content">{{ error.details }}</p>
      </template>
      <template v-else-if="error.type === 'unauthorized'">
        <h2 class="error-title">{{ error.title }}</h2>
      </template>
      <template v-else-if="error.type === 'forbidden'">
        <h2 class="error-title">{{ error.title }}</h2>
      </template>
      <template v-else-if="error.type === 'validation-error'">
        <h2 class="error-title">{{ error.title }}</h2>
      </template>
      <template v-else-if="error.type === 'fetch-data-parse'">
        <h2 class="error-title">An error occurred</h2>
        <p class="error-content">{{ error.error }}</p>
      </template>
      <template v-else-if="error.type === 'fetch-error-obj-parse'">
        <h2 class="error-title">An error occurred</h2>
        <p class="error-content">{{ error.error }}</p>
      </template>
      <template v-else-if="error.type === 'fetch-unknown-error'">
        <h2 class="error-title">An error occurred</h2>
        <p class="error-content">{{ error.error }}</p>
      </template>
    </div>
    <slot></slot>
  </div>
</template>

<style scoped>
.error {
  padding-block-end: 1rem;
}

.error-wrapper {
  color: var(--error-color);
  padding-block: 2rem;
  display: grid;
  gap: 1rem;
  place-items: center;
  text-align: center;
}

.error-wrapper.small {
  padding-block: 1rem;
  place-items: start;
  text-align: start;

  h2 {
    font-size: 1rem;
  }
}
</style>
