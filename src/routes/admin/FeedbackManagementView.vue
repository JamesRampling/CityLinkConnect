<script setup lang="ts">
import type { Feedback } from '#shared/models';
import api from '@/api';
import ApiErrorMessage from '@/components/ApiErrorMessage.vue';
import IconDelete from '@/components/icons/IconDelete.vue';
import IconMail from '@/components/icons/IconMail.vue';
import LoadedData from '@/components/LoadedData.vue';
import { useUser } from '@/user';
import type z from 'zod';

const { token } = useUser();

async function deleteFeedback(
  feedback: z.infer<typeof Feedback>[],
  feedback_id: number,
) {
  const result = await api.feedback.delete(feedback_id, token.value);
  return result.map(() =>
    feedback.filter((a) => a.feedback_id !== feedback_id),
  );
}
</script>

<template>
  <div class="item-list">
    <LoadedData :action="() => api.feedback.all(token)">
      <template #ok="{ data: feedbacks, update }">
        <article
          v-for="feedback in feedbacks"
          :key="feedback.feedback_id"
          class="card feedback-card"
        >
          <div class="card-actions button-row">
            <button
              class="button-outlined"
              @click.prevent="
                update(deleteFeedback(feedbacks, feedback.feedback_id))
              "
            >
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
