<script setup lang="ts">
import type { BookingWithService } from '@/api/endpoints/bookings';
import { formatDate, isZodError } from '@/utils';
import type z from 'zod';

defineProps<{ booking: z.infer<typeof BookingWithService> }>();
</script>

<template>
  <article :key="booking.booking_id" class="card booking-card">
    <hgroup>
      <router-link :to="`/services/book/${booking.service_id}`">
        <template v-if="isZodError(booking.service.config)">
          <h3 class="error">Unknown Service Name</h3>
        </template>
        <template v-else>
          <h3>{{ booking.service.config.name }}</h3>
        </template>
      </router-link>
      <p>
        <time :datetime="booking.booking_datetime">{{
          formatDate(booking.booking_datetime, { dateStyle: 'full' })
        }}</time>
      </p>
    </hgroup>
    <p v-if="booking.notes">{{ booking.notes }}</p>
  </article>
</template>

<style scoped>
.booking-card {
  hgroup:only-child {
    margin: 0;
  }

  h3 {
    margin-bottom: 0.5rem;
  }

  time {
    color: var(--color-muted);
  }
}

.error {
  color: var(--error-color);
}
</style>
