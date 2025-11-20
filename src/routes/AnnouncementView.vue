<script setup lang="ts">
import { Result } from '#shared/utils/Result';
import { AnnouncementJs } from '#shared/xmlModels';
import api from '@/api';
import ApiErrorMessage from '@/components/ApiErrorMessage.vue';
import IconBack from '@/components/icons/IconBack.vue';
import IconDelete from '@/components/icons/IconDelete.vue';
import IconEdit from '@/components/icons/IconEdit.vue';
import IconRefresh from '@/components/icons/IconRefresh.vue';
import InputText from '@/components/InputText.vue';
import InputTextarea from '@/components/InputTextarea.vue';
import type { LoadedDataFromAction } from '@/components/LoadedData';
import LoadedData from '@/components/LoadedData.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { useUser } from '@/user';
import { formatDate } from '@/utils';
import { useSubmission } from '@/utils/validation';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{ id: number }>();

const router = useRouter();

const { token, auth } = useUser();

const load = () => api.announcements.single(props.id);
const isEditing = ref(false);
const loadedData = ref<LoadedDataFromAction<typeof load>>();

const fields = reactive({ title: '', date: '', content: '' });
const { submit, fieldErrors, submissionError } = useSubmission(
  AnnouncementJs,
  fields,
  (form) => {
    return api.announcements.update(
      props.id,
      { config: form, sort_datetime: form.date },
      token.value,
    );
  },
  async () => {
    await loadedData.value?.update(
      Result.ok({
        announcement_id: props.id,
        sort_datetime: fields.date,
        config: fields,
      }),
    );
    isEditing.value = false;
  },
);

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
      <button class="back-button button-filled" @click="$router.back()">
        <IconBack />Back
      </button>

      <template v-if="auth?.is_admin">
        <button
          class="back-button button-outlined"
          @click="isEditing = !isEditing"
        >
          <IconEdit />Edit
        </button>

        <button
          class="back-button button-outlined"
          @click="deleteAnnouncement()"
        >
          <IconDelete />Delete
        </button>
      </template>
    </div>

    <LoadedData
      ref="loadedData"
      :action="load"
      @ok="Object.assign(fields, $event.config)"
    >
      <template #loading>
        <LoadingSpinner />
      </template>

      <template #ok="{ data: announcement }">
        <form v-if="isEditing" class="form" @submit.prevent>
          <InputText v-model="fields.title" name="title" label="Title" />
          <ul v-if="fieldErrors.title" class="error-list">
            <li
              v-for="error in fieldErrors.title"
              :key="error"
              class="error-item"
            >
              {{ error }}
            </li>
          </ul>

          <InputText
            v-model="fields.date"
            name="date"
            label="Date"
            type="date"
          />
          <ul v-if="fieldErrors.date" class="error-list">
            <li
              v-for="error in fieldErrors.date"
              :key="error"
              class="error-item"
            >
              {{ error }}
            </li>
          </ul>

          <InputTextarea v-model="fields.content" name="text" label="Content" />
          <ul v-if="fieldErrors.content" class="error-list">
            <li
              v-for="error in fieldErrors.content"
              :key="error"
              class="error-item"
            >
              {{ error }}
            </li>
          </ul>

          <div class="button-row">
            <button type="submit" class="button-filled" @click="submit()">
              Submit
            </button>
          </div>

          <ApiErrorMessage
            v-if="submissionError"
            class="small"
            :error="submissionError"
          />
        </form>
        <div v-else class="announcement">
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
