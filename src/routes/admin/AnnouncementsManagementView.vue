<script setup lang="ts">
import type { AnnouncementWithXML } from '#shared/models';
import api from '@/api';
import ApiErrorMessage from '@/components/ApiErrorMessage.vue';
import IconAdd from '@/components/icons/IconAdd.vue';
import IconDelete from '@/components/icons/IconDelete.vue';
import IconEdit from '@/components/icons/IconEdit.vue';
import LoadedData from '@/components/LoadedData.vue';
import { useUser } from '@/user';
import { formatDate } from '@/utils';
import type z from 'zod';

const { token } = useUser();

async function deleteAnnouncement(
  announcements: z.infer<typeof AnnouncementWithXML>[],
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
    <LoadedData :action="() => api.announcements.all()">
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
          <hgroup>
            <h2 class="title">{{ announcement.config?.title }}</h2>
            <p class="subtitle">
              {{ formatDate(announcement.config?.date) }}
            </p>
          </hgroup>
          <p>{{ announcement.config?.content }}</p>
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
