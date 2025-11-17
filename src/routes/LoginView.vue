<script setup lang="ts">
import api from '@/api';
import ApiErrorMessage from '@/components/ApiErrorMessage.vue';
import InputText from '@/components/InputText.vue';
import { useUser } from '@/user';
import { useSubmission } from '@/utils/validation';
import { reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import z from 'zod';

const router = useRouter();
const route = useRoute();
const email = typeof route.query.email === 'string' ? route.query.email : '';

const userState = useUser();

const LoginForm = z.object({ email: z.email(), password: z.string().min(8) });

const fields = reactive({ password: '', email });
const { submit, fieldErrors, submissionError } = useSubmission(
  LoginForm,
  fields,
  async (form) => {
    return await api.account.login(form);
  },
  async (result) => {
    userState.value = result;
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
    <p v-else class="success-message">Register successful.</p>
    <form class="form" action="" @submit.prevent="submit">
      <InputText v-model="fields.email" name="email" label="E-Mail" />
      <ul v-if="fieldErrors.email" class="error-list">
        <li v-for="error in fieldErrors.email" :key="error" class="error-item">
          {{ error }}
        </li>
      </ul>
      <InputText
        v-model="fields.password"
        type="password"
        name="password"
        label="Password"
      />
      <ul v-if="fieldErrors.password" class="error-list">
        <li
          v-for="error in fieldErrors.password"
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

    <ApiErrorMessage
      v-if="submissionError"
      class="small"
      :error="submissionError"
    />
  </div>
</template>
