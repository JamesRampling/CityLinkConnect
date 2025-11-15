<script setup lang="ts">
import api from '@/api';
import IconBack from '@/components/icons/IconBack.vue';
import LoadedData from '@/components/LoadedData.vue';
import NotFoundView from '@/routes/NotFoundView.vue';
import { formatDate } from '@/utils';

defineProps<{ id: number }>();
</script>

<template>
  <LoadedData :action="() => api.announcements.single(id)">
    <template #loading>Loading...</template>

    <template #ok="{ data: announcement }">
      <div class="page-wrapper">
        <router-link class="back-button button-filled" to="/"
          ><IconBack />Back</router-link
        >
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

    <template #error="{ error }">
      <NotFoundView v-if="error.type === 'not-found'" />
      <!-- TODO: Add better error messages -->
      <div v-else>An error occurred: {{ error }}</div>
    </template>
  </LoadedData>
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
</style>
