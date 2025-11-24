<script setup lang="ts">
import api from '@/api';
import type { AnnouncementOrError } from '@/api/endpoints/announcements';
import ApiErrorMessage from '@/components/ApiErrorMessage.vue';
import IconAdd from '@/components/icons/IconAdd.vue';
import IconDelete from '@/components/icons/IconDelete.vue';
import IconEdit from '@/components/icons/IconEdit.vue';
import LoadedData from '@/components/LoadedData.vue';
import ZodErrorMessage from '@/components/ZodErrorMessage.vue';
import { useUser } from '@/user';
import { formatDate, isZodError } from '@/utils';
import z from 'zod';

const { token } = useUser();

async function deleteAnnouncement(
  announcements: z.infer<typeof AnnouncementOrError>[],
  announcement_id: number,
) {
  const result = await api.announcements.delete(announcement_id, token.value);
  return result.map(() =>
    announcements.filter((a) => a.announcement_id !== announcement_id),
  );
}
</script>

<template>
  <div class="item-list">
    <LoadedData :action="() => api.announcements.allWithXmlErrors()">
      <template #ok="{ data: announcements, update }">
        <div class="list-actions button-row">
          <router-link to="/announcement/create" class="button-filled"
            ><IconAdd />Add Announcement</router-link
          >
        </div>

        <router-link
          v-for="announcement in announcements"
          :key="announcement.announcement_id"
          :to="`/announcement/view/${announcement.announcement_id}`"
          class="clickable card announcement-card"
        >
          <div class="card-actions button-row">
            <router-link
              class="button-outlined"
              :to="`/announcement/edit/${announcement.announcement_id}`"
              ><IconEdit aria-hidden="true" />Edit</router-link
            >
            <button
              class="button-outlined"
              @click.prevent="
                update(
                  deleteAnnouncement(
                    announcements,
                    announcement.announcement_id,
                  ),
                )
              "
            >
              <IconDelete aria-hidden="true" />Delete
            </button>
          </div>

          <ZodErrorMessage
            v-if="isZodError(announcement.config)"
            :error="announcement.config"
          >
            <template #title>Malformed XML data</template>
          </ZodErrorMessage>
          <template v-else>
            <hgroup>
              <h2 class="title">{{ announcement.config.title }}</h2>
              <p class="subtitle">
                {{ formatDate(announcement.config.date) }}
              </p>
            </hgroup>
            <p>{{ announcement.config.content }}</p>
          </template>
        </router-link>
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

.list-actions {
  margin-inline: 1.5rem;
}

.card {
  .title {
    font-size: 1.5rem;
  }
}
</style>
