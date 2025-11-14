<script setup lang="ts">
import { Feedback } from '#shared/models';
import InputText from '@/components/InputText.vue';
import InputTextarea from '@/components/InputTextarea.vue';
import { ref } from 'vue';
import { z } from 'zod';

const email = ref('');
const subject = ref('');
const message = ref('');
const errors = ref<{ [_ in keyof z.infer<typeof Feedback>]?: string[] }>({});

function handleFeedback() {
  const body = Feedback.safeParse({
    email: email.value,
    subject: subject.value,
    message: message.value,
  });
  if (!body.success) {
    errors.value = z.flattenError(body.error).fieldErrors;
  }
}
</script>

<template>
  <div class="page-wrapper">
    <h1>Give us your feedback</h1>
    <form class="form" action="" @submit.prevent="handleFeedback">
      <InputText v-model="email" name="email" label="E-Mail" />
      <ul v-if="errors.email" class="error-list">
        <li v-for="error in errors.email" :key="error" class="error-item">
          {{ error }}
        </li>
      </ul>
      <InputText v-model="subject" name="subject" label="Subject" />
      <ul v-if="errors.subject" class="error-list">
        <li v-for="error in errors.subject" :key="error" class="error-item">
          {{ error }}
        </li>
      </ul>
      <InputTextarea v-model="message" name="message" label="Feedback" />
      <ul v-if="errors.message" class="error-list">
        <li v-for="error in errors.message" :key="error" class="error-item">
          {{ error }}
        </li>
      </ul>
      <div class="button-row">
        <button type="submit" class="button-filled">Submit</button>
      </div>
    </form>
  </div>
</template>

<style>
.error-list {
  margin: 0;
  padding-inline-start: 1rem;
}

.error-item {
  color: red;
  list-style: none;
}
</style>
