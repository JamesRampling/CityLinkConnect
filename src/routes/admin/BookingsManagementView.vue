<script setup lang="ts">
import api from '@/api';
import type { BookingWithUserAndService } from '@/api/endpoints/bookings';
import ApiErrorMessage from '@/components/ApiErrorMessage.vue';
import IconDelete from '@/components/icons/IconDelete.vue';
import IconMail from '@/components/icons/IconMail.vue';
import IconPhone from '@/components/icons/IconPhone.vue';
import LoadedData from '@/components/LoadedData.vue';
import { useUser } from '@/user';
import { dateToMs, formatDateTime } from '@/utils';
import type z from 'zod';

const { token } = useUser();

async function deleteBooking(
  bookings: z.infer<typeof BookingWithUserAndService>[],
  booking_id: number,
) {
  const result = await api.bookings.delete(booking_id, token.value);
  return result.map(() => bookings.filter((b) => b.booking_id !== booking_id));
}
</script>

<template>
  <div class="item-list">
    <LoadedData :action="() => api.bookings.allAdmin(token)">
      <template #ok="{ data: bookings, update }">
        <article
          v-for="booking in bookings"
          :key="booking.booking_id"
          :class="{
            card: true,
            'booking-card': true,
            past: dateToMs(booking.booking_datetime) < Date.now(),
          }"
        >
          <div class="card-actions button-row">
            <button
              class="button-outlined"
              @click.prevent="
                update(deleteBooking(bookings, booking.booking_id))
              "
            >
              <IconDelete aria-hidden="true" />Delete
            </button>
          </div>
          <hgroup>
            <h2 class="title">
              <span class="title-text">{{ booking.service.config.name }}</span
              ><span class="tag past-tag" aria-label=" (past)">past</span>
            </h2>
            <p class="subtitle">
              <time :datetime="booking.booking_datetime">{{
                formatDateTime(booking.booking_datetime, {
                  dateStyle: 'full',
                  timeStyle: 'short',
                })
              }}</time>
            </p>
          </hgroup>
          <div class="user">
            <p class="name">
              {{ booking.user.given_names }} {{ booking.user.last_name }}
            </p>
            <div class="button-row">
              <a class="icon-link" :href="`mailto:${booking.user.email}`"
                ><IconMail aria-label="Email" />{{ booking.user.email }}</a
              >
              <a class="icon-link" :href="`tel:${booking.user.phone}`"
                ><IconPhone aria-label="phone" />{{ booking.user.phone }}</a
              >
            </div>
          </div>
          <p v-if="booking.notes">Notes: {{ booking.notes }}</p>
        </article>
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

.card {
  .title {
    font-size: 1.5rem;
  }
}

.booking-card {
  .user {
    margin-block-start: 1rem;

    &:not(:last-child) {
      margin-block-end: 1rem;
    }
  }

  .user > .name {
    margin-block-end: 0.5rem;
    font-weight: bold;
  }

  &:not(.past) .past-tag {
    display: none;
  }

  &.past {
    opacity: 0.75;
  }
}
</style>
