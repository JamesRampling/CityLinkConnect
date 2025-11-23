<script setup lang="ts">
import { Feedback } from '#shared/models';
import api from '@/api';
import ApiErrorMessage from '@/components/ApiErrorMessage.vue';
import IconSubmit from '@/components/icons/IconSubmit.vue';
import InputText from '@/components/InputText.vue';
import InputTextarea from '@/components/InputTextarea.vue';
import ValidationErrorList from '@/components/ValidationErrorList.vue';
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
      <ValidationErrorList :errors="fieldErrors.email" />

      <InputText v-model="fields.subject" name="subject" label="Subject" />
      <ValidationErrorList :errors="fieldErrors.subject" />

      <InputTextarea v-model="fields.message" name="message" label="Feedback" />
      <ValidationErrorList :errors="fieldErrors.message" />

      <div class="button-row">
        <button type="submit" class="button-filled">
          <IconSubmit />Submit
        </button>
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
