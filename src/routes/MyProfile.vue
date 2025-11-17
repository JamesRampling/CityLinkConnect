<script setup lang="ts">
import api from '@/api';
import ApiErrorMessage from '@/components/ApiErrorMessage.vue';
import BookingCard from '@/components/BookingCard.vue';
import IconRefresh from '@/components/icons/IconRefresh.vue';
import LoadedData from '@/components/LoadedData.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { useUser } from '@/user';
import { dateToMs, groupBy } from '@/utils';
import { useRouter } from 'vue-router';

// MyProfileView represents an the current logged in user's page.

const router = useRouter();
const userState = useUser();

async function logout() {
  userState.value = undefined;
  await router.push('/');
}

async function getAndSortBookings() {
  const bookings = await api.bookings.all(userState.value?.token ?? '');

  const sorted = bookings.map((b) =>
    b.sort(
      (a, b) => dateToMs(b.booking_datetime) - dateToMs(a.booking_datetime),
    ),
  );

  return sorted.map((bookings) =>
    groupBy(bookings, (e) =>
      dateToMs(e.booking_datetime) > Date.now() ? 'upcoming' : 'older',
    ),
  );
}
</script>

<template>
  <div class="page-wrapper">
    <template v-if="userState">
      <h1>{{ userState.given_names }} {{ userState.last_name }}</h1>

      <div class="button-row account-actions">
        <button class="button-filled" @click="logout()">Logout</button>
      </div>

      <div class="content">
        <section>
          <h2>Account Details</h2>
          <dl class="details-list">
            <dt>Given names</dt>
            <dd>{{ userState.given_names }}</dd>

            <dt>Last name</dt>
            <dd>{{ userState.last_name }}</dd>

            <dt>Email</dt>
            <dd>{{ userState.email }}</dd>

            <dt>Phone number</dt>
            <dd>{{ userState.phone }}</dd>
          </dl>
        </section>

        <LoadedData :action="getAndSortBookings">
          <template #loading>
            <LoadingSpinner />
          </template>

          <template #ok="{ data: { upcoming, older } }">
            <section>
              <h2>My Upcoming Bookings</h2>
              <div v-if="upcoming?.length" class="bookings-list">
                <BookingCard
                  v-for="booking in upcoming"
                  :key="booking.booking_id"
                  :booking
                />
              </div>
              <div v-else class="no-bookings">No upcoming bookings.</div>
            </section>

            <section>
              <h2>My Older Bookings</h2>
              <div v-if="older?.length" class="bookings-list">
                <BookingCard
                  v-for="booking in older"
                  :key="booking.booking_id"
                  :booking
                />
              </div>
              <div v-else class="no-bookings">No older bookings.</div>
            </section>
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
    <template v-else>
      <hgroup>
        <h1>My Account</h1>
        <p>You are not logged in.</p>
      </hgroup>
    </template>
  </div>
</template>

<style scoped>
.content {
  display: grid;
  gap: 1rem;

  > section:not(:last-child) {
    margin-bottom: 1rem;
  }
}

.account-name {
  font-size: clamp(1.75rem, 4.5vw, 2.5rem);
  font-weight: bold;
}

.account-actions {
  margin-bottom: 1rem;
}

.bookings-list {
  display: grid;
  gap: 1rem;
}

.no-bookings {
  color: var(--color-muted);
}
</style>
