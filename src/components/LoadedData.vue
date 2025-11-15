<script setup lang="ts" generic="T, E">
import type { Result } from '#shared/utils/Result';
import { ref, watch } from 'vue';

const props = defineProps<{ action: () => Promise<Result<T, E>> }>();

const result = ref<Result<T, E>>();

watch(
  () => props.action,
  async (action) => {
    result.value = undefined;
    result.value = await action();
  },
  { immediate: true },
);
</script>

<template>
  <slot v-if="result === undefined" name="loading"></slot>
  <slot v-else-if="result.ok" name="ok" :data="result.data"></slot>
  <slot v-else name="error" :error="result.error"></slot>
</template>
