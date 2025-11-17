<script setup lang="ts">
import api from '@/api';
import type { FetchError } from '@/api/apiFetch';
import ApiErrorMessage from '@/components/ApiErrorMessage.vue';
import InputText from '@/components/InputText.vue';
import { UserState, useUser } from '@/user';
import { useValidation } from '@/utils/validation';
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import z from 'zod';

const router = useRouter();
const route = useRoute();
const email = typeof route.query.email === 'string' ? route.query.email : '';

const LoginForm = z.object({ email: z.email(), password: z.string().min(8) });

const field = reactive<z.input<typeof LoginForm>>({ password: '', email });

const { parsed, errors, validate } = useValidation(LoginForm, field);

const requestError = ref<FetchError<typeof UserState>>();

const userState = useUser();

async function submit() {
  validate();
  if (!parsed.value) return;

  const result = await api.account.login(parsed.value);
  if (result.ok) {
    userState.value = result.data;
    await router.push(`/`);
  } else {
    requestError.value = result.error;
  }
}
</script>

<template>
  <div class="page-wrapper">
    <h1 class="login-less-margin">Login</h1>
    <p v-if="!route.query.email">
      Don't have an account?
      <router-link to="/register">Register here.</router-link>
    </p>
    <p v-else>Register successful.</p>
    <form class="form" action="" @submit.prevent="submit">
      <InputText v-model="field.email" name="email" label="E-Mail" />
      <ul v-if="errors.email" class="error-list">
        <li v-for="error in errors.email" :key="error" class="error-item">
          {{ error }}
        </li>
      </ul>
      <InputText
        v-model="field.password"
        type="password"
        name="password"
        label="Password"
      />
      <ul v-if="errors.password" class="error-list">
        <li v-for="error in errors.password" :key="error" class="error-item">
          {{ error }}
        </li>
      </ul>
      <div class="button-row">
        <button type="submit" class="button-filled">Submit</button>
      </div>
    </form>

    <ApiErrorMessage v-if="requestError" :error="requestError" />
  </div>
</template>

<style>
.login-less-margin {
  font-size: clamp(2rem, 5vw, 3rem);
  margin-block: 1rem 1rem;
}
</style>
