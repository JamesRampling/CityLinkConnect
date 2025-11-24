<script setup lang="ts" generic="T extends z.ZodType">
import type { FetchError } from '@/api/apiFetch';
import type z from 'zod';

const props = defineProps<{ error: FetchError<T> }>();

function defaultTitle() {
  switch (props.error.type) {
    case 'not-found':
    case 'server-error':
    case 'unauthorized':
    case 'forbidden':
    case 'validation-error':
    case 'constraint-error':
      return props.error.title;

    case 'fetch-data-parse':
    case 'fetch-error-obj-parse':
    case 'fetch-unknown-error':
      return 'An error occurred';

    default:
      props.error satisfies never;
  }
}

function defaultContent() {
  switch (props.error.type) {
    case 'not-found':
    case 'unauthorized':
    case 'forbidden':
    case 'validation-error':
    case 'constraint-error':
      return;

    case 'server-error':
      return props.error.details;

    case 'fetch-data-parse':
    case 'fetch-error-obj-parse':
      return import.meta.env.MODE === 'development'
        ? props.error.error
        : 'The data was malformed.';

    case 'fetch-unknown-error':
      return props.error.error;
  }
}
</script>

<template>
  <div class="error-wrapper">
    <div class="error">
      <slot name="error">
        <h2 class="error-title">
          <slot name="title" :error>{{ defaultTitle() }}</slot>
        </h2>

        <p class="error-content">
          <slot name="content" :error>{{ defaultContent() }}</slot>
        </p>
      </slot>
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

.error-wrapper.x-small {
  padding-block: 0;
  place-items: center;
  text-align: start;

  h2 {
    font-size: 1rem;
    margin: 0;
  }

  .error {
    padding: 0;
  }
}

.error-content:empty {
  display: none;
}
</style>
