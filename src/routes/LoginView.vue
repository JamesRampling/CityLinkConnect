<script setup lang="ts">
import { User } from '#shared/models';
import InputText from '@/components/InputText.vue';
import { useValidation } from '@/utils/validation';
import { reactive } from 'vue';
import z from 'zod';

const field = reactive({
  given_names: '',
  last_name: '',
  password: '',
  email: '',
  phone: '',
});
const { errors, validate } = useValidation(
  User.extend({ password: z.string().min(8) }),
  field,
);
</script>

<template>
  <div class="page-wrapper">
    <h1>Login</h1>
    <form class="form" action="" @submit.prevent="validate">
      <InputText v-model="field.email" name="email" label="E-Mail" />
      <ul v-if="errors.email" class="error-list">
        <li v-for="error in errors.email" :key="error" class="error-item">
          {{ error }}
        </li>
      </ul>
      <InputText name="password" label="Password" />
      <ul v-if="errors.password" class="error-list">
        <li v-for="error in errors.password" :key="error" class="error-item">
          {{ error }}
        </li>
      </ul>
      <div class="button-row">
        <button type="submit" class="button-filled">Submit</button>
        <router-link to="/register"
          ><button class="button-outlined">Register</button></router-link
        >
      </div>
    </form>
  </div>
</template>
