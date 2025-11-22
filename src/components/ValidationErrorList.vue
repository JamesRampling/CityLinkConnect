<script setup lang="ts">
defineProps<{ errors: string[] | undefined }>();
</script>

<template>
  <ul v-if="errors" class="error-list">
    <li v-for="error in errors" :key="error" class="error-item">
      {{ error }}
    </li>
  </ul>
</template>
