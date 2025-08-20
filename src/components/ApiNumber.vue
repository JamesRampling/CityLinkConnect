<script setup lang="ts">
import { type Message } from '#shared/message';

const res = await fetch('/api/number');
const num = await res.json();
const msg = num as Message;
</script>

<template>{{ msg.num }} says {{ msg.message }}</template>

<style scoped></style>
