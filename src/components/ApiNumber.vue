<script setup lang="ts">
const res = await fetch('/api/number');
const num = await res.text();
</script>

<template>
  {{ num }}
</template>

<style scoped></style>
