<script setup lang="ts">
import api from '@/api';
import ApiErrorMessage from '@/components/ApiErrorMessage.vue';
import IconAdd from '@/components/icons/IconAdd.vue';
import IconDelete from '@/components/icons/IconDelete.vue';
import IconEdit from '@/components/icons/IconEdit.vue';
import IconMail from '@/components/icons/IconMail.vue';
import IconPhone from '@/components/icons/IconPhone.vue';
import LoadedData from '@/components/LoadedData.vue';
import { useUser } from '@/user';
import { dateToMs, formatDate, formatDateTime } from '@/utils';
import { type ComponentPublicInstance } from 'vue';

defineProps<{ selectedPage: string }>();

const { token } = useUser();

const pages = [
  { id: 'users', name: 'Users' },
  { id: 'bookings', name: 'Bookings' },
  { id: 'announcements', name: 'Announcements' },
  { id: 'services', name: 'Services' },
  { id: 'feedback', name: 'Feedback' },
];

// Ensure selected tab is in view when navigating to admin page.
function scrollIntoView(element: Element | ComponentPublicInstance | null) {
  if (element instanceof Element) {
    const selected = element.querySelector('.selected');
    requestAnimationFrame(() => {
      selected?.scrollIntoView();
    });
  }
}
</script>

<template>
  <div class="title-wrapper page-wrapper">
    <h1 class="title">Admin Options</h1>
  </div>

  <div class="tab-wrapper">
    <div
      :ref="(e) => scrollIntoView(e)"
      class="tab-bar page-wrapper"
      role="tablist"
    >
      <router-link
        v-for="page in pages"
        :id="selectedPage === page.id ? 'selected-tab' : undefined"
        :key="page.id"
        :to="`/admin/${page.id}`"
        :class="{ tab: true, selected: selectedPage === page.id }"
        role="tab"
        :aria-selected="selectedPage === page.id"
        :aria-expanded="selectedPage === page.id"
        aria-controls="tab-panel"
      >
        {{ page.name }}
      </router-link>
    </div>
  </div>

  <div
    id="tab-panel"
    class="page-wrapper"
    role="tabpanel"
    aria-labelledby="selected-tab"
  >
    <div v-if="selectedPage === 'users'" class="item-list">
      <LoadedData :action="() => api.account.all(token)">
        <template #ok="{ data }">
          <article
            v-for="user in data"
            :key="user.user_id"
            class="card user-card"
          >
            <div class="card-actions button-row">
              <router-link
                class="button-outlined"
                :to="`/user/edit/${user.user_id}`"
                ><IconEdit />Edit</router-link
              >
              <button class="button-outlined"><IconDelete />Delete</button>
            </div>
            <h2 class="title">{{ user.given_names }} {{ user.last_name }}</h2>

            <div class="button-row">
              <a class="icon-link" :href="`mailto:${user.email}`"
                ><IconMail aria-label="Email" />{{ user.email }}</a
              >
              <a class="icon-link" :href="`tel:${user.phone}`"
                ><IconPhone aria-label="phone" />{{ user.phone }}</a
              >
            </div>
          </article>
        </template>

        <template #error="{ error }">
          <ApiErrorMessage :error />
        </template>
      </LoadedData>
    </div>

    <div v-else-if="selectedPage === 'bookings'" class="item-list">
      <LoadedData :action="() => api.bookings.allAdmin(token)">
        <template #ok="{ data: bookings }">
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
              <button class="button-outlined"><IconDelete />Delete</button>
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

    <div v-else-if="selectedPage === 'announcements'" class="item-list">
      <LoadedData :action="() => api.announcements.all()">
        <template #ok="{ data: announcements }">
          <div class="list-actions button-row">
            <router-link to="/announcement/create" class="button-filled"
              ><IconAdd />Add Announcement</router-link
            >
          </div>

          <router-link
            v-for="announcement in announcements"
            :key="announcement.announcement_id"
            :to="`/announcement/view/${announcement.announcement_id}`"
            class="clickable card announcement-card"
          >
            <div class="card-actions button-row">
              <router-link
                class="button-outlined"
                :to="`/announcement/edit/${announcement.announcement_id}`"
                ><IconEdit />Edit</router-link
              >
              <button
                class="button-outlined"
                @click="
                  api.announcements.delete(announcement.announcement_id, token)
                "
              >
                <IconDelete />Delete
              </button>
            </div>
            <hgroup>
              <h2 class="title">{{ announcement.config?.title }}</h2>
              <p class="subtitle">
                {{ formatDate(announcement.config?.date) }}
              </p>
            </hgroup>
            <p>{{ announcement.config?.content }}</p>
          </router-link>
        </template>

        <template #error="{ error }">
          <ApiErrorMessage :error />
        </template>
      </LoadedData>
    </div>

    <div v-else-if="selectedPage === 'services'" class="item-list">
      <LoadedData :action="() => api.services.allAdmin(token)">
        <template #ok="{ data: services }">
          <div class="list-actions button-row">
            <router-link to="/services/create" class="button-filled"
              ><IconAdd />Add Service</router-link
            >
          </div>

          <router-link
            v-for="service in services"
            :key="service.service_id"
            :to="`/services/book/${service.service_id}`"
            :class="{
              clickable: true,
              card: true,
              'service-card': true,
              hidden: service.is_hidden,
            }"
          >
            <div class="card-actions button-row">
              <router-link
                class="button-outlined"
                :to="`/services/edit/${service.service_id}`"
                ><IconEdit />Edit</router-link
              >
            </div>

            <h2 class="title">
              <span class="title-text">{{ service.config.name }}</span>
              <span class="tag hidden-tag" aria-label=" (hidden)">hidden</span>
            </h2>
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
          </router-link>
        </template>

        <template #error="{ error }">
          <ApiErrorMessage :error />
        </template>
      </LoadedData>
    </div>

    <div v-else-if="selectedPage === 'feedback'" class="item-list">
      <LoadedData :action="() => api.feedback.all(token)">
        <template #ok="{ data: feedbacks }">
          <article
            v-for="feedback in feedbacks"
            :key="feedback.feedback_id"
            class="card feedback-card"
          >
            <div class="card-actions button-row">
              <button class="button-outlined"><IconDelete />Delete</button>
            </div>
            <hgroup>
              <h2 class="title">{{ feedback.subject }}</h2>
              <div class="button-row">
                <a class="icon-link" :href="`mailto:${feedback.email}`"
                  ><IconMail aria-label="Email" />{{ feedback.email }}</a
                >
              </div>
            </hgroup>
            <p>{{ feedback.message }}</p>
          </article>
        </template>

        <template #error="{ error }">
          <ApiErrorMessage :error />
        </template>
      </LoadedData>
    </div>
  </div>
</template>

<style lang="css" scoped>
.title-wrapper {
  padding-block-end: 0;

  .title {
    margin-block: 1rem 1.5rem;
  }
}

.tab-wrapper {
  background-color: var(--bgcolor);
  user-select: none;

  position: sticky;
  top: 3.5rem;

  .tab-bar {
    display: flex;
    padding: 0;
    width: calc(100% - 2rem);
    max-width: calc(90ch - 2rem);
    overflow: auto;
    border-bottom: 1px solid var(--border-color);
  }

  .tab {
    padding: 1rem 1.5rem;

    text-align: center;
    font-size: medium;
    background-color: transparent;

    cursor: pointer;

    border: none;

    color: inherit;
    text-decoration: none;
    position: relative;

    &:hover,
    &:focus-visible {
      background-color: var(--button-outlined-hover-bgcolor);
    }

    &.selected::after {
      content: '';
      position: absolute;
      inset: auto 0 0;
      border-bottom: 4px solid var(--accent-color);
    }
  }
}

.item-list {
  display: grid;
  gap: 1rem;
}

.list-actions {
  margin-inline: 1.5rem;
}

.card {
  .card-actions {
    float: right;
    justify-content: end;
    max-width: 30%;

    @media (width < 60ch) {
      float: none;
      max-width: none;
      margin-bottom: 0.5rem;
      justify-content: start;
    }
  }
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

.tag {
  font-size: 1rem;
  background-color: var(--accent-color);
  color: var(--on-accent-color);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  margin-inline-start: 0.5rem;
}

.service-card {
  &:not(.hidden) .hidden-tag {
    display: none;
  }

  &.hidden {
    opacity: 0.75;
  }

  p,
  .fee,
  .fee h3 {
    margin-block-end: 0.5rem;
  }
}
</style>
