<script setup lang="ts">
import { Booking } from '#shared/models';
import api from '@/api';
import type { FetchError } from '@/api/apiFetch';
import ApiErrorMessage from '@/components/ApiErrorMessage.vue';
import IconBack from '@/components/icons/IconBack.vue';
import IconDelete from '@/components/icons/IconDelete.vue';
import IconEdit from '@/components/icons/IconEdit.vue';
import IconRefresh from '@/components/icons/IconRefresh.vue';
import InputText from '@/components/InputText.vue';
import InputTextarea from '@/components/InputTextarea.vue';
import LoadedData from '@/components/LoadedData.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { useUser } from '@/user';
import { useSubmission } from '@/utils/validation';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{ id: number }>();

const router = useRouter();

const { token, auth } = useUser();

const success = ref(false);
const fields = reactive({ booking_datetime: '', notes: '' });
const { submit, fieldErrors, submissionError } = useSubmission(
  Booking.omit({ booking_id: true, user_id: true, service_id: true }),
  fields,
  async (form) => {
    return await api.bookings.create(
      { ...form, service_id: props.id },
      token.value,
    );
  },
  () => (success.value = true),
);

const deleteError = ref<FetchError<undefined>>();

async function deleteService() {
  const { ok, error } = await api.services.delete(props.id, token.value);
  if (ok) {
    await router.push('/');
    deleteError.value = undefined;
  } else {
    deleteError.value = error;
  }
}
</script>

<template>
  <div class="page-wrapper">
    <div class="button-row">
      <router-link to="/services" class="back-button button-filled">
        <IconBack />Back
      </router-link>

      <template v-if="auth?.is_admin">
        <router-link class="button-outlined" :to="`/services/edit/${id}`">
          <IconEdit />Edit
        </router-link>

        <!-- Deleting a service does not work as there are no delete actions in
        database, so constraints may be violated if there are bookings under
        this service. -->
        <button class="button-outlined" @click="deleteService()">
          <IconDelete />Delete
        </button>

        <ApiErrorMessage
          v-if="deleteError"
          :error="deleteError"
          class="x-small"
        />
      </template>
    </div>

    <h1>Book a service</h1>
    <LoadedData :action="() => api.services.single(id)">
      <template #loading>
        <LoadingSpinner />
      </template>

      <template #ok="{ data: service }">
        <div class="content-wrapper">
          <section class="section-service-info">
            <h2>{{ service.config.name }}</h2>
            <p>{{ service.config.description }}</p>

            <div v-if="service?.config.fees" class="fees">
              <div
                v-for="{ title, prices } of service.config.fees"
                :key="title"
                class="fee"
              >
                <h3>{{ title }}</h3>
                <ul>
                  <li v-for="{ variant, price } of prices" :key="variant">
                    <strong class="fee-name">{{ variant }}</strong> &ndash;
                    {{ price }}
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <div class="separator"></div>

          <section class="section-form">
            <h2>Booking details</h2>
            <form
              v-if="token && !success"
              class="form"
              action=""
              @submit.prevent="submit"
            >
              <InputText
                v-model="fields.booking_datetime"
                type="datetime-local"
                name="date-input"
                label="Date"
              />
              <ul v-if="fieldErrors.booking_datetime" class="error-list">
                <li
                  v-for="error in fieldErrors.booking_datetime"
                  :key="error"
                  class="error-item"
                >
                  {{ error }}
                </li>
              </ul>
              <InputTextarea
                v-model="fields.notes"
                name="service-notes"
                label="Additional information"
              />
              <div class="button-row">
                <button type="submit" class="button-filled">Submit</button>
              </div>
            </form>
            <p v-else-if="!success">
              Please login before making a service booking.
            </p>
            <p v-else class="success-message">
              Your booking has been submitted!
            </p>

            <ApiErrorMessage
              v-if="submissionError"
              class="small"
              :error="submissionError"
            />
          </section>
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

.content-wrapper {
  display: grid;
  gap: 2rem;
}

.fee {
  margin-block-end: 1rem;
}

.fee-name {
  text-transform: capitalize;
}
</style>
