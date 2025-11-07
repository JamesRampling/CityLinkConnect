<script setup lang="ts">
import { ref } from 'vue';
import { number } from 'zod';

const props = defineProps({
  id: { type: number, required: false, default: 1345423331 },
  name: { type: String, required: false, default: 'AdminName' },
});

interface UserBooking {
  name: string;
  service: string;
  message: string;
}
function generateUserBooking() {
  const bookingList: UserBooking = [
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

const userList = ['User1', 'User2', 'User3'];

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
      <div v-if="page === 1"></div>
      <div v-else-if="page === 2"></div>
      <div v-else-if="page === 3"></div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.squareButton {
  width: 100%;
  height: auto;
  padding-top: 10%;
  padding-bottom: 10%;
  text-align: center;
  font-size: medium;
  font-family: Arial, Helvetica, sans-serif;
  background-color: lightgray;
  line-height: 50%;
  border: 1px;
  transition: 1.2s;
  height: auto;
  font-weight: bold;
}
.squarebutton:hover {
  background-color: black;
  color: white;
}

.flex-container {
  flex: auto;
  flex-wrap: wrap;
  flex-direction: row;
  display: flex;
}
#sidebar {
  flex-direction: column;
  display: flex;
}
</style>
