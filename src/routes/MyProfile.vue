<script setup lang="ts">
import { PasswordString, User } from '#shared/models';
import api from '@/api';
import ApiErrorMessage from '@/components/ApiErrorMessage.vue';
import BookingCard from '@/components/BookingCard.vue';
import IconRefresh from '@/components/icons/IconRefresh.vue';
import InputText from '@/components/InputText.vue';
import LoadedData from '@/components/LoadedData.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ValidationErrorList from '@/components/ValidationErrorList.vue';
import { useUser } from '@/user';
import { dateToMs, groupBy } from '@/utils';
import { useSubmission } from '@/utils/validation';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import z from 'zod';

// MyProfileView represents an the current logged in user's page.

const router = useRouter();
const { setUserState, userInfo, token } = useUser();

const ChangePasswordForm = z
  .object({
    oldPassword: z.string(),
    newPassword: PasswordString,
    confirmPassword: z.string(),
  })
  .refine((obj) => obj.newPassword === obj.confirmPassword, {
    error: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

const passwordFields = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});
const passwordDialog = ref<HTMLDialogElement>();
const passwordChanged = ref(false);
const {
  fieldErrors: passwordErrors,
  submissionError: changePasswordError,
  submit: submitPassword,
} = useSubmission(
  ChangePasswordForm,
  passwordFields,
  (form) => api.account.updatePassword(form, token.value),
  () => {
    passwordFields.oldPassword = '';
    passwordFields.newPassword = '';
    passwordFields.confirmPassword = '';
    passwordDialog.value?.close();
    passwordChanged.value = true;
  },
);

const isEditing = ref(false);

const detailsFields = reactive({
  given_names: '',
  last_name: '',
  email: '',
  phone: '',
  ...userInfo.value,
});
const {
  fieldErrors: detailsErrors,
  submissionError: detailsSubmissionError,
  submit: submitDetails,
} = useSubmission(
  User.omit({ user_id: true }),
  detailsFields,
  async (form) => {
    const result = await api.account.updateDetails(form, token.value);

    if (result.error?.type === 'unauthorized') {
      setUserState(undefined);
    }

    return result;
  },
  (details) => {
    setUserState({ ...details, token: token.value });
    isEditing.value = false;
  },
);

function resetDetails() {
  isEditing.value = false;
  detailsErrors.value = {};
  detailsSubmissionError.value = undefined;
  Object.assign(detailsFields, userInfo.value);
}

async function logout() {
  setUserState(undefined);
  await router.push('/');
}

async function getAndSortBookings() {
  const bookings = await api.bookings.all(token.value);

  const sorted = bookings.map((b) =>
    b.sort(
      (a, b) => dateToMs(b.booking_datetime) - dateToMs(a.booking_datetime),
    ),
  );

  return sorted.map((bookings) =>
    groupBy(bookings, (e) =>
      dateToMs(e.booking_datetime) > Date.now() ? 'upcoming' : 'past',
    ),
  );
}
</script>

<template>
  <div class="page-wrapper">
    <template v-if="userInfo">
      <h1>{{ userInfo.given_names }} {{ userInfo.last_name }}</h1>

      <div class="button-row account-actions">
        <router-link to="/admin" class="button-filled"
          >Admin Options</router-link
        >
        <button class="button-filled" @click="logout()">Logout</button>
        <button class="button-filled" @click="passwordDialog?.showModal()">
          Change Password
        </button>
        <button
          v-if="!isEditing"
          class="button-filled"
          @click="isEditing = true"
        >
          Edit Account Details
        </button>
      </div>

      <p v-if="passwordChanged" class="success-message">
        Password changed successfully.
      </p>

      <div class="content">
        <section>
          <h2>Account Details</h2>
          <dl v-if="!isEditing" class="details-list">
            <dt>Given names</dt>
            <dd>{{ userInfo.given_names }}</dd>

            <dt>Last name</dt>
            <dd>{{ userInfo.last_name }}</dd>

            <dt>Email</dt>
            <dd>{{ userInfo.email }}</dd>

            <dt>Phone number</dt>
            <dd>{{ userInfo.phone }}</dd>
          </dl>
          <form v-else class="form" action="" @submit.prevent="submitDetails()">
            <InputText
              v-model="detailsFields.given_names"
              name="given-names"
              label="Given Names"
            />
            <ValidationErrorList :errors="detailsErrors.given_names" />

            <InputText
              v-model="detailsFields.last_name"
              name="last-name"
              label="Last Name"
            />
            <ValidationErrorList :errors="detailsErrors.last_name" />

            <InputText
              v-model="detailsFields.email"
              name="email"
              label="E-Mail"
            />
            <ValidationErrorList :errors="detailsErrors.email" />

            <InputText
              v-model="detailsFields.phone"
              name="phone"
              label="Phone Number"
            />
            <ValidationErrorList :errors="detailsErrors.phone" />

            <div class="button-row">
              <button type="submit" class="button-filled">Submit</button>
              <button
                type="button"
                class="button-outlined"
                @click="resetDetails()"
              >
                Cancel
              </button>
            </div>

            <ApiErrorMessage
              v-if="detailsSubmissionError"
              class="small"
              :error="detailsSubmissionError"
            >
              <template #title="{ error }">
                <span v-if="error.type === 'constraint-error'">
                  Email or phone number are already in use.
                </span>
              </template>
            </ApiErrorMessage>
          </form>
        </section>

        <LoadedData :action="getAndSortBookings">
          <template #loading>
            <LoadingSpinner />
          </template>

          <template #ok="{ data: { upcoming, past } }">
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
              <h2>My Past Bookings</h2>
              <div v-if="past?.length" class="bookings-list">
                <BookingCard
                  v-for="booking in past"
                  :key="booking.booking_id"
                  :booking
                />
              </div>
              <div v-else class="no-bookings">No past bookings.</div>
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

    <dialog ref="passwordDialog">
      <h2>Change Password</h2>
      <form class="form" action="" @submit.prevent="submitPassword">
        <InputText
          v-model="passwordFields.oldPassword"
          type="password"
          name="oldPassword"
          label="Current Password"
        />
        <ValidationErrorList :errors="passwordErrors.oldPassword" />

        <InputText
          v-model="passwordFields.newPassword"
          type="password"
          name="newPassword"
          label="New Password"
        />
        <ValidationErrorList :errors="passwordErrors.newPassword" />

        <InputText
          v-model="passwordFields.confirmPassword"
          type="password"
          name="password"
          label="Confirm Password"
        />
        <ValidationErrorList :errors="passwordErrors.confirmPassword" />

        <div class="button-row">
          <button type="submit" class="button-filled">Submit</button>
          <button
            type="button"
            class="button-outlined"
            @click="passwordDialog?.close()"
          >
            Cancel
          </button>
        </div>

        <ApiErrorMessage
          v-if="changePasswordError"
          class="small"
          :error="changePasswordError"
        />
      </form>
    </dialog>
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

dialog[open] {
  border-radius: 1rem;
  background-color: var(--dialog-bgcolor);
  color: var(--dialog-color);
  border: none;
  outline: 1px solid var(--dialog-border-color);
  box-shadow: var(--dialog-shadow);
}
</style>
