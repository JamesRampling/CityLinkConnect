<script setup lang="ts">
import { useUser } from '@/user';
import { useRouter } from 'vue-router';

// MyProfileView represents an the current logged in user's page.

const router = useRouter();
const userState = useUser();

async function logout() {
  userState.value = undefined;
  await router.push('/');
}
</script>

<template>
  <div class="page-wrapper">
    <template v-if="userState">
      <h1>{{ userState.given_names }} {{ userState.last_name }}</h1>

      <dl class="details-list">
        <dt>Given names</dt>
        <dd>{{ userState.given_names }}</dd>

        <dt>Last name</dt>
        <dd>{{ userState.last_name }}</dd>

        <dt>Email</dt>
        <dd>{{ userState.email }}</dd>

        <dt>Phone number</dt>
        <dd>{{ userState.phone }}</dd>
      </dl>

      <div class="button-row">
        <button class="button-filled" @click="logout()">Logout</button>
      </div>
    </template>
    <template v-else>
      <hgroup>
        <h1>My Account</h1>
        <p>You are not logged in.</p>
      </hgroup>
    </template>
  </div>
</template>

<style scoped>
.account-name {
  font-size: clamp(1.75rem, 4.5vw, 2.5rem);
  font-weight: bold;
}

.details-list {
  margin-bottom: 1rem;
}
</style>
