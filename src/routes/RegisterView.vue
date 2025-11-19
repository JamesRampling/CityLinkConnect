<script setup lang="ts">
import { User } from '#shared/models';
import api from '@/api';
import ApiErrorMessage from '@/components/ApiErrorMessage.vue';
import InputText from '@/components/InputText.vue';
import { useSubmission } from '@/utils/validation';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import z from 'zod';

const router = useRouter();

const RegisterForm = User.omit({ user_id: true }).extend({
  password: z.string().min(8),
});

const fields = reactive({
  given_names: '',
  last_name: '',
  password: '',
  email: '',
  phone: '',
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
      <ul v-if="fieldErrors.given_names" class="error-list">
        <li
          v-for="error in fieldErrors.given_names"
          :key="error"
          class="error-item"
        >
          {{ error }}
        </li>
      </ul>

      <InputText
        v-model="fields.last_name"
        name="last-name"
        label="Last Name"
      />
      <ul v-if="fieldErrors.last_name" class="error-list">
        <li
          v-for="error in fieldErrors.last_name"
          :key="error"
          class="error-item"
        >
          {{ error }}
        </li>
      </ul>

      <InputText v-model="fields.email" name="email" label="E-Mail" />
      <ul v-if="fieldErrors.email" class="error-list">
        <li v-for="error in fieldErrors.email" :key="error" class="error-item">
          {{ error }}
        </li>
      </ul>

      <InputText v-model="fields.phone" name="phone" label="Phone Number" />
      <ul v-if="fieldErrors.phone" class="error-list">
        <li v-for="error in fieldErrors.phone" :key="error" class="error-item">
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
    >
      <template #title="{ error }">
        <span v-if="error.type === 'constraint-error'">
          User already exists.
        </span>
      </template>
    </ApiErrorMessage>
  </div>
</template>
