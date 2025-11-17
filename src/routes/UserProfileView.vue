<script setup lang="ts">
// UserProfileView represents an admin view of any particular user.
defineProps<{ id: number }>();
</script>

<template>
  <div class="page-wrapper">
    <h1>User profile {{ id }}</h1>
  </div>
</template>

<style scoped></style>
