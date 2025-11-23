<script setup lang="ts">
import api from '@/api';
import ApiErrorMessage from '@/components/ApiErrorMessage.vue';
import InputText from '@/components/InputText.vue';
import ValidationErrorList from '@/components/ValidationErrorList.vue';
import { useUser } from '@/user';
import { useSubmission } from '@/utils/validation';
import { reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import z from 'zod';

const router = useRouter();
const route = useRoute();
const email = typeof route.query.email === 'string' ? route.query.email : '';

const { setUserState } = useUser();

const LoginForm = z.object({ email: z.email(), password: z.string() });

const fields = reactive({ password: '', email });
const { submit, fieldErrors, submissionError } = useSubmission(
  LoginForm,
  fields,
  api.account.login,
  async (result) => {
    setUserState(result);
    await router.push(`/`);
  },
);
</script>

<template>
  <div class="page-wrapper">
    <h1>Login</h1>
    <p v-if="!route.query.email">
      Don't have an account?
      <router-link to="/register">Register here.</router-link>
    </p>
    <p v-else class="success-message">Registration successful!</p>
    <form class="form" action="" @submit.prevent="submit">
      <InputText v-model="fields.email" name="email" label="E-Mail" />
      <ValidationErrorList :errors="fieldErrors.email" />

      <InputText
        v-model="fields.password"
        type="password"
        name="password"
        label="Password"
      />
      <ValidationErrorList :errors="fieldErrors.password" />

      <div class="button-row">
        <button type="submit" class="button-filled">Login</button>
      </div>
    </form>

    <ApiErrorMessage
      v-if="submissionError"
      class="small"
      :error="submissionError"
    />
  </div>
</template>
