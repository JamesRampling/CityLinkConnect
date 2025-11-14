<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  id: { type: Number, required: false, default: 1345423331 },
  name: { type: String, required: false, default: 'AdminName' },
});

interface UserBooking {
  name: string;
  service: string;
  message: string;
}

interface User{
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

const userList = ['User1', 'User2', 'User3'];

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
  <h1>Good morning {{ name }}</h1>
  <div class="flex-container">
    <div id="SideBar">
      <button class="squareButton" @click="page = 1">Users</button>
      <button class="squareButton" @click="page = 2">Bookings</button>
      <button class="squareButton" @click="page = 3">Content</button>
    </div>
    <div id="MainContent">
      <div v-if="page === 1">
        <list>
          <li v-for="user in generateUsers()" :key="user.id">
            <strong>{{ user.name }}</strong> — {{ user.email }} 
            <span v-if="user.isBanned">(Banned)</span>
          </li>
        </list>
      </div>
      <div v-else-if="page === 2">
        <ul>
          <li v-for="(b, i) in bookings" :key="i">
            <strong>{{ b.name }}</strong> — {{ b.service }}: {{ b.message }}
          </li>
        </ul>
      </div>
      <div v-else-if="page === 3">
        <article
      v-for="item in articles"
      :key="item.title"
      class="clickable-card"
      @click="$router.push(`/announcement/${item.id}`)"
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
  width: 100%;
  padding-top: 10%;
  padding-bottom: 10%;
  text-align: center;
  font-size: medium;
  font-family: Arial, Helvetica, sans-serif;
  background-color: lightgray;
  line-height: 50%;
  border: 1px solid #ccc;
  transition: background-color 0.2s ease, color 0.2s ease;
  font-weight: bold;
  cursor: pointer;
}
.squareButton:hover {
  background-color: black;
  color: white;
}

.flex-container {
  flex: auto;
  flex-wrap: wrap;
  flex-direction: row;
  display: flex;
}
#SideBar {
  flex-direction: column;
  display: flex;
}
</style>
