<script setup lang="ts">
import { Announcement } from '#shared/models';
import { AnnouncementContent, AnnouncementJs } from '#shared/xmlModels';
import api from '@/api';
import ApiErrorMessage from '@/components/ApiErrorMessage.vue';
import IconBack from '@/components/icons/IconBack.vue';
import IconRefresh from '@/components/icons/IconRefresh.vue';
import InputText from '@/components/InputText.vue';
import InputTextarea from '@/components/InputTextarea.vue';
import LoadedData from '@/components/LoadedData.vue';
import ValidationErrorList from '@/components/ValidationErrorList.vue';
import { useUser } from '@/user';
import { useSubmission } from '@/utils/validation';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import type z from 'zod';

const props = defineProps<{ id: number }>();

const router = useRouter();

const { token } = useUser();

const fields = reactive({ title: '', date: '', content: '' });
const {
  submit: submitStructural,
  fieldErrors,
  submissionError,
} = useSubmission(
  AnnouncementJs,
  fields,
  (form) => {
    const config = AnnouncementContent.encode(form);

    return api.announcements.update(
      props.id,
      { config, sort_datetime: form.date },
      token.value,
    );
  },
  async () => {
    await router.push(`/announcement/view/${props.id}`);
  },
);

const editingXml = ref(false);
const xmlFields = reactive({ config: '', sort_datetime: '' });
const {
  submit: submitXml,
  fieldErrors: xmlErrors,
  submissionError: xmlSubmissionError,
} = useSubmission(
  Announcement,
  xmlFields,
  (form) => api.announcements.update(props.id, form, token.value),
  async () => {
    await router.push(`/announcement/view/${props.id}`);
  },
);

function toggleXmlEditing(state: boolean) {
  submissionError.value = undefined;
  xmlSubmissionError.value = undefined;
  editingXml.value = state;
}

function setFields(announcement: z.infer<typeof Announcement>) {
  try {
    Object.assign(fields, AnnouncementContent.decode(announcement.config));
  } catch {}

  Object.assign(xmlFields, announcement);
}

async function submit() {
  if (editingXml.value) await submitXml();
  else await submitStructural();
}
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

      <button
        v-if="!editingXml"
        class="button-outlined"
        @click="toggleXmlEditing(true)"
      >
        Edit as XML
      </button>
      <button v-else class="button-outlined" @click="toggleXmlEditing(false)">
        Edit as form
      </button>
    </div>

    <LoadedData
      :action="() => api.announcements.single(props.id)"
      @ok="setFields($event)"
    >
      <template #ok>
        <form class="form" @submit.prevent>
          <template v-if="!editingXml">
            <InputText v-model="fields.title" name="title" label="Title" />
            <ValidationErrorList :errors="fieldErrors.title" />

            <InputText
              v-model="fields.date"
              name="date"
              label="Date"
              type="date"
            />
            <ValidationErrorList :errors="fieldErrors.date" />

            <InputTextarea
              v-model="fields.content"
              name="text"
              label="Content"
            />
            <ValidationErrorList :errors="fieldErrors.content" />
          </template>
          <template v-else>
            <InputText
              v-model="xmlFields.sort_datetime"
              name="date"
              label="Sort Date"
              type="date"
            />
            <ValidationErrorList :errors="xmlErrors.sort_datetime" />

            <InputTextarea
              v-model="xmlFields.config"
              name="text"
              label="Config"
            />
            <ValidationErrorList :errors="xmlErrors.config" />
          </template>

          <div class="button-row">
            <button type="submit" class="button-filled" @click="submit()">
              Submit
            </button>
          </div>

          <ApiErrorMessage
            v-if="!editingXml && submissionError"
            class="small"
            :error="submissionError"
          />
          <ApiErrorMessage
            v-else-if="xmlSubmissionError"
            class="small"
            :error="xmlSubmissionError"
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
