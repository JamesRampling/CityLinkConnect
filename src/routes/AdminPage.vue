<script setup lang="ts">
import { ref } from 'vue';

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

const articles = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  title: 'Scheduled Road Maintenance',
  date: new Date(`2025-10-${(i + 1).toString().padStart(2, '0')}`),
  content: `
      The council will begin scheduled road maintenance on Main Street and
      adjoining roads from the 10th of October to the 14th of October.
      Residents are advised to plan alternative routes.
    `,
}));

const page = ref(1);
</script>

<template>
  <h1>Good morning Admin</h1>
  <div class="flex-container">
    <div id="SideBar">
      <button
        :class="{ squareButton: true, isSelected: page === 1 }"
        @click="page = 1"
      >
        Users
      </button>
      <button
        :class="{ squareButton: true, isSelected: page === 2 }"
        @click="page = 2"
      >
        Bookings
      </button>
      <button
        :class="{ squareButton: true, isSelected: page === 3 }"
        @click="page = 3"
      >
        Content
      </button>
    </div>
    <div id="MainContent">
      <div v-if="page === 1">
        <ul id="ItemsDisplayColumn">
          <li
            v-for="user in generateUsers()"
            :key="user.id"
            class="clickable-card"
          >
            <strong>{{ user.name }}</strong> — {{ user.email }}
            <span v-if="user.isBanned">(Banned)</span>
          </li>
        </ul>
      </div>
      <div v-else-if="page === 2">
        <ul id="ItemsDisplayColumn">
          <li v-for="(b, i) in bookings" :key="i" class="clickable-card">
            <strong>{{ b.name }}</strong> — {{ b.service }}: {{ b.message }}
          </li>
        </ul>
      </div>
      <div v-else-if="page === 3">
        <article
          v-for="item in articles"
          :key="item.title"
          class="clickable-card"
        >
          <h2>{{ item.title }}</h2>
          <h3>{{ item.date.toLocaleDateString('en-AU') }}</h3>
          <p>{{ item.content }}</p>
        </article>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
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
.SideBar {
  flex-direction: column;
  display: flex;
  width: 500sp;
  height: 20sp;
}
#MainContent {
  margin: auto;
  width: 50%;
  padding: 10px;
  display: flex;
  align-items: baseline;
}
</style>
