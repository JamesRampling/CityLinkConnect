<script setup lang="ts">
import api from '@/api';
import ApiErrorMessage from '@/components/ApiErrorMessage.vue';
import IconBack from '@/components/icons/IconBack.vue';
import IconDelete from '@/components/icons/IconDelete.vue';
import IconEdit from '@/components/icons/IconEdit.vue';
import IconRefresh from '@/components/icons/IconRefresh.vue';
import LoadedData from '@/components/LoadedData.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { useUser } from '@/user';
import { formatDate } from '@/utils';
import { useRouter } from 'vue-router';

const props = defineProps<{ id: number }>();

const router = useRouter();

const { token, auth } = useUser();

async function deleteAnnouncement() {
  const { ok } = await api.announcements.delete(props.id, token.value);
  if (ok) {
    await router.push('/');
  }
}
</script>

<template>
  <div class="page-wrapper">
    <div class="button-row">
      <router-link to="/" class="back-button button-filled">
        <IconBack />Back
      </router-link>

      <template v-if="auth?.is_admin">
        <router-link class="button-outlined" :to="`/announcement/edit/${id}`">
          <IconEdit />Edit
        </router-link>

        <button class="button-outlined" @click="deleteAnnouncement()">
          <IconDelete />Delete
        </button>
      </template>
    </div>

    <LoadedData
      ref="loadedData"
      :action="() => api.announcements.single(props.id)"
    >
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
