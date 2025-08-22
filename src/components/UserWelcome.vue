<script setup lang="ts">
import { User } from '#shared/user';

const res = await fetch('/api/user');
const raw = await res.json();
const msg = User.safeParse(raw);
</script>

<template>
  <template v-if="msg.success">
    Hi {{ msg.data.name }}! You were born in
    {{ msg.data.date_of_birth.getFullYear() }} and your id is {{ msg.data.id }}.
  </template>
  <template v-else>{{ msg.error }}</template>
</template>

<style scoped></style>
