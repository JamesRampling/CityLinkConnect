<script setup lang="ts">
import api from '@/api';
import ApiErrorMessage from '@/components/ApiErrorMessage.vue';
import IconBack from '@/components/icons/IconBack.vue';
import IconRefresh from '@/components/icons/IconRefresh.vue';
import LoadedData from '@/components/LoadedData.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { formatDate } from '@/utils';

defineProps<{ id: number }>();
</script>

<template>
  <div class="page-wrapper">
    <button class="back-button button-filled" @click="$router.back()">
      <IconBack />Back
    </button>
    <LoadedData :action="() => api.announcements.single(id)">
      <template #loading>
        <LoadingSpinner />
      </template>

      <template #ok="{ data: announcement }">
        <div class="announcement">
          <hgroup>
            <h1>{{ announcement.config.title }}</h1>
            <p>
              <time :datetime="announcement.config.date">{{
                formatDate(announcement.config.date, { dateStyle: 'full' })
              }}</time>
            </p>
          </hgroup>
          <p>{{ announcement.config.content }}</p>
        </div>
      </template>

      <template #error="{ error, retry }">
        <ApiErrorMessage :error>
          <button class="button-filled" @click="retry()">
            <IconRefresh />Retry
          </button>
        </ApiErrorMessage>
      </template>
    </LoadedData>
  </div>
</template>

<style scoped>
.back-button {
  width: fit-content;
}

time {
  color: var(--color-muted);
  font-weight: 700;
  font-size: 1.25rem;
}

.page-wrapper {
  gap: 1rem;
}
</style>
