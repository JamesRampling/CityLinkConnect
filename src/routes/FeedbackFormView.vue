<script setup lang="ts">
import { Feedback } from '#shared/models';
import api from '@/api';
import ApiErrorMessage from '@/components/ApiErrorMessage.vue';
import InputText from '@/components/InputText.vue';
import InputTextarea from '@/components/InputTextarea.vue';
import { useSubmission } from '@/utils/validation';
import { reactive, ref } from 'vue';

const success = ref(false);
const fields = reactive({ email: '', subject: '', message: '' });
const { submit, fieldErrors, submissionError } = useSubmission(
  Feedback.omit({ feedback_id: true }),
  fields,
  api.feedback.create,
  () => (success.value = true),
);
</script>

<template>
  <div class="page-wrapper">
    <h1>Give us your feedback</h1>
    <form v-if="!success" class="form" action="" @submit.prevent="submit">
      <InputText v-model="fields.email" name="email" label="E-Mail" />
      <ul v-if="fieldErrors.email" class="error-list">
        <li v-for="error in fieldErrors.email" :key="error" class="error-item">
          {{ error }}
        </li>
      </ul>
      <InputText v-model="fields.subject" name="subject" label="Subject" />
      <ul v-if="fieldErrors.subject" class="error-list">
        <li
          v-for="error in fieldErrors.subject"
          :key="error"
          class="error-item"
        >
          {{ error }}
        </li>
      </ul>
      <InputTextarea v-model="fields.message" name="message" label="Feedback" />
      <ul v-if="fieldErrors.message" class="error-list">
        <li
          v-for="error in fieldErrors.message"
          :key="error"
          class="error-item"
        >
          {{ error }}
        </li>
      </ul>
      <div class="button-row">
        <button type="submit" class="button-filled">Submit</button>
      </div>
    </form>
    <p v-else class="success-message">
      Your feedback has been received successfully!
    </p>

    <ApiErrorMessage
      v-if="submissionError"
      class="small"
      :error="submissionError"
    />
  </div>
</template>
