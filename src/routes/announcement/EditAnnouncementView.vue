<script setup lang="ts">
import { Announcement, AnnouncementWithXML } from '#shared/models';
import { Result } from '#shared/utils/Result';
import { AnnouncementContent, AnnouncementJs } from '#shared/xmlModels';
import api from '@/api';
import type { FetchError } from '@/api/apiFetch';
import ApiErrorMessage from '@/components/ApiErrorMessage.vue';
import IconBack from '@/components/icons/IconBack.vue';
import IconCode from '@/components/icons/IconCode.vue';
import IconForm from '@/components/icons/IconForm.vue';
import IconRefresh from '@/components/icons/IconRefresh.vue';
import IconSubmit from '@/components/icons/IconSubmit.vue';
import InputText from '@/components/InputText.vue';
import InputTextarea from '@/components/InputTextarea.vue';
import LoadedData from '@/components/LoadedData.vue';
import ValidationErrorList from '@/components/ValidationErrorList.vue';
import { useUser } from '@/user';
import { useSubmission } from '@/utils/validation';
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import type z from 'zod';

const props = defineProps<{ id?: number }>();

const isCreating = computed(() => props.id === undefined);

const router = useRouter();

const { token } = useUser();

async function loadData() {
  return isCreating.value
    ? Promise.resolve(
        Result.ok<object, FetchError<typeof AnnouncementWithXML>>({}),
      )
    : api.announcements.single(props.id);
}

async function submitAnnouncement(
  announcement: Omit<z.infer<typeof Announcement>, 'announcement_id'>,
) {
  if (isCreating.value) {
    return await api.announcements.create(announcement, token.value);
  } else {
    return await api.announcements.update(props.id, announcement, token.value);
  }
}

async function navigate(
  announcement: z.infer<typeof Announcement> | undefined,
) {
  if (isCreating.value && announcement) {
    await router.replace(`/announcement/view/${announcement.announcement_id}`);
  } else {
    router.back();
  }
}

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

    return submitAnnouncement({ config, sort_datetime: form.date });
  },
  navigate,
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
  (form) => submitAnnouncement(form),
  navigate,
);

function toggleXmlEditing(state: boolean) {
  submissionError.value = undefined;
  xmlSubmissionError.value = undefined;
  editingXml.value = state;
}

function setFields(announcement: z.infer<typeof Announcement> | object) {
  try {
    if ('config' in announcement) {
      Object.assign(fields, AnnouncementContent.decode(announcement.config));
    }
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
      <button class="back-button button-filled" @click="$router.back()">
        <IconBack />Back
      </button>

      <button
        v-if="!editingXml"
        class="button-outlined"
        @click="toggleXmlEditing(true)"
      >
        <IconCode />
        <template v-if="isCreating">Create using XML</template>
        <template v-else>Edit as XML</template>
      </button>
      <button v-else class="button-outlined" @click="toggleXmlEditing(false)">
        <IconForm />
        <template v-if="isCreating">Create using form</template>
        <template v-else>Edit as form</template>
      </button>
    </div>

    <LoadedData :action="loadData" @ok="setFields($event)">
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
              <IconSubmit />Submit
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
