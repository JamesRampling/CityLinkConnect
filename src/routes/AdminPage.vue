<script setup lang="ts">
import { useExampleData } from '@/exampleData';
import { formatDate } from '@/utils';
import { computed, ref } from 'vue';

interface UserBooking {
  name: string;
  service: string;
  message: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  isBanned: boolean;
}

function generateUsers(): User[] {
  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `User${i + 1}`,
    email: `user${i + 1}@example.com`,
    isBanned: false,
  }));
}

function generateUserBooking(): UserBooking[] {
  return [
    {
      name: 'user1',
      service: 'PetService',
      message: 'Need help with pet caring',
    },
    {
      name: 'user2',
      service: 'GroomingService',
      message: 'Requesting grooming for my dog',
    },
    {
      name: 'user3',
      service: 'WalkingService',
      message: 'Need daily evening walks for my pet',
    },
    {
      name: 'user4',
      service: 'VeterinaryService',
      message: 'Pet needs vaccination checkup',
    },
    {
      name: 'user5',
      service: 'TrainingService',
      message: 'Want basic obedience training',
    },
    {
      name: 'user6',
      service: 'BoardingService',
      message: 'Need weekend boarding for my cat',
    },
    {
      name: 'user7',
      service: 'PetTaxi',
      message: 'Require transport to vet clinic',
    },
    {
      name: 'user8',
      service: 'PetPhotography',
      message: 'Looking for pet portrait session',
    },
    {
      name: 'user9',
      service: 'PetSitting',
      message: 'Need sitter for two days',
    },
    {
      name: 'user10',
      service: 'AquariumCleaning',
      message: 'Need help cleaning my fish tank',
    },
  ];
}

const bookings = ref<UserBooking[]>(generateUserBooking());

const { announcements, services } = useExampleData();

const articles = computed(() =>
  announcements.value
    .map((e, i) => ({ config: e, announcement_id: i }))
    .sort(
      (a, b) =>
        new Date(b.config.date).valueOf() - new Date(a.config.date).valueOf(),
    ),
);

const serviceItems = computed(() =>
  services.value.map((e, i) => ({ config: e, service_id: i })),
);

const page = ref('user');
</script>

<template>
  <h1>Good morning Admin</h1>
  <div class="flex-container">
    <div id="SideBar">
      <button
        :class="{ squareButton: true, isSelected: page === 'user' }"
        @click="page = 'user'"
      >
        Users
      </button>
      <button
        :class="{ squareButton: true, isSelected: page === 'booking' }"
        @click="page = 'booking'"
      >
        Bookings
      </button>
      <button
        :class="{ squareButton: true, isSelected: page === 'content' }"
        @click="page = 'content'"
      >
        Content
      </button>
      <button
        :class="{ squareButton: true, isSelected: page === 'service' }"
        @click="page = 'service'"
      >
        Services
      </button>
      <button
        :class="{ squareButton: true, isSelected: page === 'feedback' }"
        @click="page = 'feedback'"
      >
        Feedback
      </button>
    </div>
    <div id="MainContent">
      <div v-if="page === 'user'">
        <ul id="ItemsDisplayColumn">
          <li
            v-for="user in generateUsers()"
            :key="user.id"
            class="clickable card"
          >
            <strong>{{ user.name }}</strong> — {{ user.email }}
            <span v-if="user.isBanned">(Banned)</span>
          </li>
        </ul>
      </div>
      <div v-else-if="page === 'booking'">
        <ul id="ItemsDisplayColumn">
          <li v-for="(b, i) in bookings" :key="i" class="clickable card">
            <strong>{{ b.name }}</strong> — {{ b.service }}: {{ b.message }}
          </li>
        </ul>
      </div>
      <div v-else-if="page === 'content'" id="ItemsDisplayColumn">
        <article
          v-for="item in articles"
          :key="item.config.title"
          class="clickable card"
        >
          <button>Edit</button>
          <h2>{{ item.config.title }}</h2>
          <h3>{{ formatDate(item.config.date) }}</h3>
          <p>{{ item.config.content }}</p>
        </article>
      </div>
      <div v-else-if="page === 'service'" id="ItemsDisplayColumn">
        <li v-for="(e, i) in services" :key="i" class="clickable card">
          <button>Edit</button>
          <strong>{{ e.fees }}</strong> — {{ e.name }}
        </li>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.SideBar {
  flex-direction: column;
  display: flex;
  width: 8rem;
  height: 2rem;
}
.squareButton {
  padding-top: 10%;
  width: 100%;

  height: 25sp;
  padding-bottom: 10%;
  text-align: center;
  font-size: medium;
  background: transparent;
  line-height: 50%;
  border: 1px solid var(--border-color);
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
  font-weight: bold;
  cursor: pointer;
}

.squareButton:hover {
  background-color: var(--button-outlined-hover-bgcolor);
}
.squareButton.isSelected {
  background-color: var(--accent-color);
  color: var(--on-accent-color);
}

.flex-container {
  flex: auto;
  flex-wrap: wrap;
  flex-direction: row;
  display: flex;
}

#MainContent {
  margin: auto;
  width: 50%;
  padding: 10px;
  display: flex;
  align-items: baseline;
}
#ItemsDisplayColumn {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
