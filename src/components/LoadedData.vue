<script setup lang="ts" generic="T, E">
import type { Result } from '#shared/utils/Result';
import type { LoadedData } from '@/components/LoadedData';
import { ref, watch } from 'vue';

const props = defineProps<{ action: () => Promise<Result<T, E>> }>();
const emit = defineEmits<{ (e: 'ok', d: T): void; (e: 'err', d: E): void }>();

const result = ref<Result<T, E>>();

watch(
  () => props.action,
  async (action) => {
    result.value = undefined;
    result.value = await action();
    if (result.value.ok) {
      emit('ok', result.value.data);
    } else {
      emit('err', result.value.error);
    }
  },
  { immediate: true },
);

async function execute() {
  result.value = undefined;
  result.value = await props.action();
}

async function update(data: Result<T, E> | Promise<Result<T, E>>) {
  result.value = await data;
}

defineExpose<LoadedData<T, E>>({ update, execute });
</script>

<template>
  <slot v-if="result === undefined" name="loading"></slot>
  <slot v-else-if="result.ok" name="ok" :data="result.data"></slot>
  <slot v-else name="error" :error="result.error" :retry="execute"></slot>
</template>
