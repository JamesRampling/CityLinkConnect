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
    <h1 class="login-less-margin">Register</h1>
    <p><router-link to="/login">Login here.</router-link></p>
    <form class="form" action="" @submit.prevent="validate">
      <InputText
        v-model="field.given_names"
        name="given-names"
        label="Given Names"
      />
      <ul v-if="errors.given_names" class="error-list">
        <li v-for="error in errors.given_names" :key="error" class="error-item">
          {{ error }}
        </li>
      </ul>

      <InputText v-model="field.last_name" name="last-name" label="Last Name" />
      <ul v-if="errors.last_name" class="error-list">
        <li v-for="error in errors.last_name" :key="error" class="error-item">
          {{ error }}
        </li>
      </ul>
      <InputText v-model="field.email" name="email" label="E-Mail" />
      <ul v-if="errors.email" class="error-list">
        <li v-for="error in errors.email" :key="error" class="error-item">
          {{ error }}
        </li>
      </ul>
      <InputText
        v-model="field.password"
        type="assword"
        name="password"
        label="Password"
      />
      <ul v-if="errors.password" class="error-list">
        <li v-for="error in errors.password" :key="error" class="error-item">
          {{ error }}
        </li>
      </ul>
      <InputText v-model="field.phone" name="phone" label="Phone Number" />
      <ul v-if="errors.phone" class="error-list">
        <li v-for="error in errors.phone" :key="error" class="error-item">
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

.login-less-margin {
  font-size: clamp(2rem, 5vw, 3rem);
  margin-block: 1rem 1rem;
}
</style>
