<script setup lang="ts">
import api from '@/api';
import ApiErrorMessage from '@/components/ApiErrorMessage.vue';
import IconDelete from '@/components/icons/IconDelete.vue';
import IconEdit from '@/components/icons/IconEdit.vue';
import IconMail from '@/components/icons/IconMail.vue';
import IconPhone from '@/components/icons/IconPhone.vue';
import LoadedData from '@/components/LoadedData.vue';
import { useUser } from '@/user';

const { token } = useUser();
</script>

<template>
  <div class="item-list">
    <LoadedData :action="() => api.account.all(token)">
      <template #ok="{ data }">
        <article
          v-for="user in data"
          :key="user.user_id"
          class="card user-card"
        >
          <div class="card-actions button-row">
            <router-link
              class="button-outlined"
              :to="`/user/edit/${user.user_id}`"
              ><IconEdit aria-hidden="true" />Edit</router-link
            >
            <button class="button-outlined">
              <IconDelete aria-hidden="true" />Delete
            </button>
          </div>
          <h2 class="title">{{ user.given_names }} {{ user.last_name }}</h2>

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
