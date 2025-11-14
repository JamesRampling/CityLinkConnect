<script setup lang="ts">
import { User } from '#shared/models';
import InputText from '@/components/InputText.vue';
import { ref } from 'vue';
import { z } from 'zod';

const givenNames = ref('asdfasdf');
const lastName = ref('asdasdf');
const email = ref('adsfads@dsfasdf.com');
const password = ref('asdfasdf');
const phone = ref('0123456789');
const errors = ref<{ [_ in keyof z.infer<typeof User>]?: string[] }>({});

function handleRegistration() {
  const body = User.safeParse({
    given_names: givenNames.value,
    last_name: lastName.value,
    email: email.value,
    phone: phone.value,
  });
  if (!body.success) {
    errors.value = z.flattenError(body.error).fieldErrors;
  }
}
</script>

<template>
  <div class="page-wrapper">
    <h1>Register</h1>
    <form class="form" action="" @submit.prevent="handleRegistration">
      <InputText v-model="givenNames" name="given-names" label="Given Names" />
      <ul v-if="errors.given_names" class="error-list">
        <li v-for="error in errors.given_names" :key="error">{{ error }}</li>
      </ul>

      <InputText v-model="lastName" name="last-name" label="Last Name" />
      <ul v-if="errors.last_name" class="error-list">
        <li v-for="error in errors.last_name" :key="error" class="error-item">
          {{ error }}
        </li>
      </ul>
      <InputText v-model="email" name="email" label="E-Mail" />
      <ul v-if="errors.email" class="error-list">
        <li v-for="error in errors.email" :key="error" class="error-item">
          {{ error }}
        </li>
      </ul>
      <InputText v-model="password" name="password" label="Password" />
      <InputText v-model="phone" name="phone" label="Phone Number" />
      <ul v-if="errors.given_names" class="error-item">
        <li v-for="error in errors.phone" :key="error">{{ error }}</li>
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
