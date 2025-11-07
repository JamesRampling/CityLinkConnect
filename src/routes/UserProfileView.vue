<script setup lang="ts">
defineProps<{ id: number }>();
</script>

<template>
  <div class="page-wrapper">
    <h1>User profile {{ id }}</h1>
  </div>
</template>

<style scoped></style>
