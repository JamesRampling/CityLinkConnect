<script setup lang="ts">
import api from '@/api';
import ApiErrorMessage from '@/components/ApiErrorMessage.vue';
import IconDelete from '@/components/icons/IconDelete.vue';
import IconMail from '@/components/icons/IconMail.vue';
import LoadedData from '@/components/LoadedData.vue';
import { useUser } from '@/user';

const { token } = useUser();
</script>

<template>
  <div class="item-list">
    <LoadedData :action="() => api.feedback.all(token)">
      <template #ok="{ data: feedbacks }">
        <article
          v-for="feedback in feedbacks"
          :key="feedback.feedback_id"
          class="card feedback-card"
        >
          <div class="card-actions button-row">
            <button class="button-outlined">
              <IconDelete aria-hidden="true" />Delete
            </button>
          </div>
          <hgroup>
            <h2 class="title">{{ feedback.subject }}</h2>
            <div class="button-row">
              <a class="icon-link" :href="`mailto:${feedback.email}`"
                ><IconMail aria-label="Email" />{{ feedback.email }}</a
              >
            </div>
          </hgroup>
          <p>{{ feedback.message }}</p>
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
