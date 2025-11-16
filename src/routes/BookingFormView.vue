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
import { useValidation } from '@/utils/validation';
import { reactive } from 'vue';

defineProps<{ id: number }>();

const field = reactive({ booking_datetime: '', notes: '' });
const { errors, validate } = useValidation(
  Booking.omit({ user_id: true, service_id: true }),
  field,
);
</script>

<template>
  <div class="page-wrapper">
    <router-link class="back-button button-filled" to="/services"
      ><IconBack />Back</router-link
    >
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
            <form class="form" action="" @submit.prevent="validate">
              <InputText
                v-model="field.booking_datetime"
                type="datetime-local"
                name="date-input"
                label="Date"
              />
              <ul v-if="errors.booking_datetime" class="error-list">
                <li
                  v-for="error in errors.booking_datetime"
                  :key="error"
                  class="error-item"
                >
                  {{ error }}
                </li>
              </ul>
              <InputTextarea
                name="service-notes"
                label="Additional information"
              />
              <div class="button-row">
                <button type="submit" class="button-filled">Submit</button>
              </div>
            </form>
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

.error-list {
  margin: 0;
  padding-inline-start: 1rem;
}

.error-item {
  color: red;
  list-style: none;
}
</style>
