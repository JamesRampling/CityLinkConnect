<script setup lang="ts">
import { Booking } from '#shared/models';
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
import { reactive, ref } from 'vue';

const { id: service_id } = defineProps<{ id: number }>();

const { userState } = useUser();

const success = ref(false);
const fields = reactive({ booking_datetime: '', notes: '' });
const { submit, fieldErrors, submissionError } = useSubmission(
  Booking.omit({ user_id: true, service_id: true }),
  fields,
  async (form) => {
    const auth = userState.value?.token ?? '';
    return await api.bookings.create({ ...form, service_id }, auth);
  },
  () => (success.value = true),
);
</script>

<template>
  <div class="page-wrapper">
    <button class="back-button button-filled" @click="$router.back()">
      <IconBack />Back
    </button>
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
                v-for="[fee, prices] of Object.entries(service.config.fees)"
                :key="fee"
                class="fee"
              >
                <h3>{{ fee }}</h3>
                <ul>
                  <li
                    v-for="[title, price] of Object.entries(prices)"
                    :key="title"
                  >
                    <strong class="fee-name">{{ title }}</strong> &ndash;
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
              v-if="userState && !success"
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
