<script setup lang="ts">
import api from '@/api';
import ApiErrorMessage from '@/components/ApiErrorMessage.vue';
import IconAdmin from '@/components/icons/IconAdmin.vue';
import IconMail from '@/components/icons/IconMail.vue';
import IconPhone from '@/components/icons/IconPhone.vue';
import LoadedData from '@/components/LoadedData.vue';
import { useUser } from '@/user';

const { token } = useUser();
</script>

<template>
  <div class="item-list">
    <LoadedData :action="() => api.account.all(token)">
      <template #ok="{ data: users }">
        <article
          v-for="user in users"
          :key="user.user_id"
          class="card user-card"
        >
          <h2 class="title">
            {{ user.given_names }} {{ user.last_name }}
            <span v-if="user.is_admin" class="admin-tag tag"
              ><IconAdmin aria-hidden="true" />admin</span
            >
          </h2>

          <div class="button-row">
            <a class="icon-link" :href="`mailto:${user.email}`"
              ><IconMail aria-label="Email" />{{ user.email }}</a
            >
            <a class="icon-link" :href="`tel:${user.phone}`"
              ><IconPhone aria-label="phone" />{{ user.phone }}</a
            >
          </div>
        </article>
      </template>

      <template #error="{ error }">
        <ApiErrorMessage :error />
      </template>
    </LoadedData>
  </div>
</template>

<style scoped>
.item-list {
  display: grid;
  gap: 1rem;
}

.card {
  .title {
    font-size: 1.5rem;
  }
}
</style>
