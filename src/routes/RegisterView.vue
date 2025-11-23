<script setup lang="ts">
import { PasswordString, User } from '#shared/models';
import api from '@/api';
import ApiErrorMessage from '@/components/ApiErrorMessage.vue';
import InputText from '@/components/InputText.vue';
import ValidationErrorList from '@/components/ValidationErrorList.vue';
import { useSubmission } from '@/utils/validation';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import z from 'zod';

const router = useRouter();

const RegisterForm = User.omit({ user_id: true })
  .extend({ password: PasswordString, passwordConfirm: z.string() })
  .refine((obj) => obj.password === obj.passwordConfirm, {
    error: 'Passwords do not match.',
    path: ['passwordConfirm'],
  });

const fields = reactive({
  given_names: '',
  last_name: '',
  email: '',
  phone: '',
  password: '',
  passwordConfirm: '',
});
const { submit, fieldErrors, submissionError } = useSubmission(
  RegisterForm,
  fields,
  api.account.register,
  () => router.push(`/login?email=${fields.email}`),
);
</script>

<template>
  <div class="page-wrapper">
    <h1>Register</h1>
    <p>
      Already have an account?
      <router-link to="/login">Login here.</router-link>
    </p>
    <form class="form" action="" @submit.prevent="submit">
      <InputText
        v-model="fields.given_names"
        name="given-names"
        label="Given Names"
      />
      <ValidationErrorList :errors="fieldErrors.given_names" />

      <InputText
        v-model="fields.last_name"
        name="last-name"
        label="Last Name"
      />
      <ValidationErrorList :errors="fieldErrors.last_name" />

      <InputText v-model="fields.email" name="email" label="E-Mail" />
      <ValidationErrorList :errors="fieldErrors.email" />

      <InputText v-model="fields.phone" name="phone" label="Phone Number" />
      <ValidationErrorList :errors="fieldErrors.phone" />

      <InputText
        v-model="fields.password"
        type="password"
        name="password"
        label="Password"
      />
      <ValidationErrorList :errors="fieldErrors.password" />

      <InputText
        v-model="fields.passwordConfirm"
        type="password"
        name="password"
        label="Confirm Password"
      />
      <ValidationErrorList :errors="fieldErrors.passwordConfirm" />

      <div class="button-row">
        <button type="submit" class="button-filled">Register</button>
      </div>
    </form>

    <ApiErrorMessage
      v-if="submissionError"
      class="small"
      :error="submissionError"
    >
      <template #title="{ error }">
        <span v-if="error.type === 'constraint-error'">
          User already exists.
        </span>
      </template>
    </ApiErrorMessage>
  </div>
</template>
