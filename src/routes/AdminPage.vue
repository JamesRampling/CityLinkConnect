<script setup lang="ts">
import api from '@/api';
import ApiErrorMessage from '@/components/ApiErrorMessage.vue';
import BookingCard from '@/components/BookingCard.vue';
import IconAdd from '@/components/icons/IconAdd.vue';
import IconDelete from '@/components/icons/IconDelete.vue';
import IconEdit from '@/components/icons/IconEdit.vue';
import LoadedData from '@/components/LoadedData.vue';
import { useUser } from '@/user';
import { formatDate } from '@/utils';
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
  <div class="page-wrapper">
    <h1>Admin Options</h1>

    <div :ref="(e) => scrollIntoView(e)" class="tab-bar">
      <router-link
        v-for="page in pages"
        :key="page.id"
        :to="`/admin/${page.id}`"
        :class="{ tab: true, selected: selectedPage === page.id }"
      >
        {{ page.name }}
      </router-link>
    </div>

    <div v-if="selectedPage === 'users'" class="item-list">
      <LoadedData :action="() => api.account.all(token)">
        <template #ok="{ data }">
          <div v-for="user in data" :key="user.user_id" class="clickable card">
            <strong>{{ user.given_names }}</strong> — {{ user.email }}
          </div>
        </template>

        <template #error="{ error }">
          <ApiErrorMessage :error />
        </template>
      </LoadedData>
    </div>

    <div v-else-if="selectedPage === 'bookings'" class="item-list">
      <LoadedData :action="() => api.bookings.allAdmin(token)">
        <template #ok="{ data: bookings }">
          <BookingCard v-for="b in bookings" :key="b.booking_id" :booking="b" />
        </template>

        <template #error="{ error }">
          <ApiErrorMessage :error />
        </template>
      </LoadedData>
    </div>

    <div v-else-if="selectedPage === 'announcements'" class="item-list">
      <LoadedData :action="() => api.announcements.all()">
        <template #ok="{ data: announcements }">
          <div class="button-row">
            <router-link to="/announcement/create" class="button-filled"
              ><IconAdd />Add Announcement</router-link
            >
          </div>

          <article
            v-for="announcement in announcements"
            :key="announcement.announcement_id"
            class="clickable card"
          >
            <div class="button-row">
              <router-link
                class="button-outlined"
                :to="`/announcement/edit/${announcement.announcement_id}`"
                ><IconEdit />Edit Announcement</router-link
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
            <h2>{{ announcement.config?.title }}</h2>
            <h3>{{ formatDate(announcement.config?.date) }}</h3>
            <p>{{ announcement.config?.content }}</p>
          </article>
        </template>

        <template #error="{ error }">
          <ApiErrorMessage :error />
        </template>
      </LoadedData>
    </div>

    <div v-else-if="selectedPage === 'services'" class="item-list">
      <LoadedData :action="() => api.services.all()">
        <template #ok="{ data: services }">
          <div class="button-row">
            <router-link to="/services/create" class="button-filled"
              ><IconAdd />Add Service</router-link
            >
          </div>

          <div
            v-for="service in services"
            :key="service.service_id"
            class="card"
          >
            <div class="button-row">
              <router-link
                class="button-outlined"
                :to="`/services/edit/${service.service_id}`"
                ><IconEdit />Edit Service</router-link
              >
            </div>

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
          </div>
        </template>

        <template #error="{ error }">
          <ApiErrorMessage :error />
        </template>
      </LoadedData>
    </div>

    <div v-else-if="selectedPage === 'feedback'" class="item-list">
      <LoadedData :action="() => api.feedback.all(token)">
        <template #ok="{ data: feedbacks }">
          <div
            v-for="feedback in feedbacks"
            :key="feedback.feedback_id"
            class="card"
          >
            <h3>
              Feedback ID: {{ feedback.feedback_id }} email ({{
                feedback.email
              }})
            </h3>
            <p>{{ feedback.message }}</p>
          </div>
        </template>

        <template #error="{ error }">
          <ApiErrorMessage :error />
        </template>
      </LoadedData>
    </div>
  </div>
</template>

<style lang="css" scoped>
.tab-bar {
  background-color: var(--bgcolor);
  display: flex;

  align-self: start;
  position: sticky;
  top: 3.5rem;
  overflow: auto;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 1rem;
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

.item-list {
  display: grid;
  gap: 1rem;
}
</style>
