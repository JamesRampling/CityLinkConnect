<script setup lang="ts">
import { AnnouncementJs } from '#shared/xmlModels';
import api from '@/api';
import ApiErrorMessage from '@/components/ApiErrorMessage.vue';
import IconBack from '@/components/icons/IconBack.vue';
import IconRefresh from '@/components/icons/IconRefresh.vue';
import InputText from '@/components/InputText.vue';
import InputTextarea from '@/components/InputTextarea.vue';
import LoadedData from '@/components/LoadedData.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { useUser } from '@/user';
import { useSubmission } from '@/utils/validation';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{ id: number }>();

const router = useRouter();

const { token } = useUser();

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
    await router.push(`/announcement/view/${props.id}`);
  },
);
</script>

<template>
  <div class="page-wrapper">
    <div class="button-row">
      <router-link
        :to="`/announcement/view/${id}`"
        class="back-button button-filled"
      >
        <IconBack />Back
      </router-link>
    </div>

    <LoadedData
      :action="() => api.announcements.single(props.id)"
      @ok="Object.assign(fields, $event.config)"
    >
      <template #loading>
        <LoadingSpinner />
      </template>

      <template #ok>
        <form class="form" @submit.prevent>
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
