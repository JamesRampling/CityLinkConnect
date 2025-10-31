<script setup lang="ts">
import { ApiError } from '#shared/errors';
import { User } from '#shared/models';
import InputText from '@/components/InputText.vue';
import { ref } from 'vue';
import type z from 'zod';

const givenNames = ref('asdfasdf');
const lastName = ref('asdasdf');
const email = ref('adsfads@dsfasdf.com');
const password = ref('asdfasdf');
const phone = ref('0123456789');

const result = ref<string | z.infer<typeof User> | z.infer<typeof ApiError>>(
  'no request sent',
);

const handleRegistration = async () => {
  const body = User.safeParse({
    given_names: givenNames.value,
    last_name: lastName.value,
    email: email.value,
    phone: phone.value,
  });
  if (body.success) {
    const response = await fetch('/api/account/register', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify(body.data),
    });

    if (response.ok) {
      const data = User.parse(await response.json());
      result.value = data;
    } else {
      const data = ApiError.parse(await response.json());
      result.value = data;
    }
    console.log(result.value);
  } else {
    result.value = 'validation error';
    console.log(body.error);
  }
};
</script>

<template>
  <div class="page-wrapper">
    <h1>Register</h1>
    <form class="form" action="" @submit.prevent="handleRegistration">
      <InputText v-model="givenNames" name="given-names" label="Given Names" />
      <InputText v-model="lastName" name="last-name" label="Last Name" />
      <InputText v-model="email" name="email" label="E-Mail" />
      <InputText v-model="password" name="password" label="Password" />
      <InputText v-model="phone" name="phone" label="Phone Number" />

      <div class="button-row">
        <button type="submit" class="button-filled">Submit</button>
      </div>
    </form>

    {{ result }}
  </div>
</template>
