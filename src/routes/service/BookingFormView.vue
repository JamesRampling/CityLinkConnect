<script setup lang="ts">
import { Booking } from '#shared/models';
import api from '@/api';
import ApiErrorMessage from '@/components/ApiErrorMessage.vue';
import IconBack from '@/components/icons/IconBack.vue';
import IconEdit from '@/components/icons/IconEdit.vue';
import IconRefresh from '@/components/icons/IconRefresh.vue';
import InputText from '@/components/InputText.vue';
import InputTextarea from '@/components/InputTextarea.vue';
import LoadedData from '@/components/LoadedData.vue';
import ValidationErrorList from '@/components/ValidationErrorList.vue';
import ZodErrorMessage from '@/components/ZodErrorMessage.vue';
import { useUser } from '@/user';
import { isZodError } from '@/utils';
import { useSubmission } from '@/utils/validation';
import { reactive, ref } from 'vue';

const props = defineProps<{ id: number }>();

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
</script>

<template>
  <div class="page-wrapper">
    <div class="button-row">
      <button class="back-button button-filled" @click="$router.back()">
        <IconBack />Back
      </button>

      <template v-if="auth?.is_admin">
        <router-link class="button-outlined" :to="`/services/edit/${id}`">
          <IconEdit />Edit Service
        </router-link>
      </template>
    </div>

    <h1>Book a service</h1>
    <LoadedData :action="() => api.services.singleJs(id, token)">
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
            <p v-if="service.is_hidden">
              Cannot make a booking with a hidden service.
            </p>
            <form
              v-else-if="token && !success"
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
              <ValidationErrorList :errors="fieldErrors.booking_datetime" />

              <InputTextarea
                v-model="fields.notes"
                name="service-notes"
                label="Additional information"
              />
              <ValidationErrorList :errors="fieldErrors.notes" />

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

          <template
            v-if="
              auth?.is_admin &&
              error.type === 'fetch-data-parse' &&
              isZodError(error.error)
            "
            #error
          >
            <ZodErrorMessage :error="error.error" />
          </template>
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
