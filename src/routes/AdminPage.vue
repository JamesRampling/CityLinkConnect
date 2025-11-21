<script setup lang="ts">
import {
  AnnouncementWithXML,
  Booking,
  Feedback,
  ServiceWithXML,
  User,
} from '#shared/models';
import api from '@/api';
import InputText from '@/components/InputText.vue';
import InputTextarea from '@/components/InputTextarea.vue';
import { formatDate } from '@/utils';
import { onMounted, ref } from 'vue';
import { z } from 'zod';

/** 
const addContentField = (
  title = "",
  content = ""
)
**/
interface UserBooking {
  name: string;
  service: string;
  message: string;
}

interface Feedback {
  feedback_id: number;
  sort_datetime: string;
  config: { user: string; message: string; date: string };
}

/** 
function generateUsers(): User[] {
  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `User${i + 1}`,
    email: `user${i + 1}@example.com`,
    isBanned: false,
  }));
}
**/
/** 
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
**/

const bookings = ref<z.infer<typeof Booking>[]>([]);
const feedback = ref<z.infer<typeof Feedback>[]>([]);
const announcements = ref<z.infer<typeof AnnouncementWithXML>[]>([]);
const services = ref<z.infer<typeof ServiceWithXML>[]>([]);
const userList = ref<z.infer<typeof User>[]>([]);
const fields = ref({ title: '', content: '', name: '', fees: '' });

const submit = async () => {
  // Submit logic will go here
  console.log('Form submitted:', fields.value);
};

// Load announcements and services
onMounted(async () => {
  const announcementResult = await api.announcements.all();
  if (announcementResult.ok) {
    announcements.value = announcementResult.data;
  }

  const servicesResult = await api.services.all();
  if (servicesResult.ok) {
    services.value = servicesResult.data;
  }

  const userResult = await api.account.all(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc19hZG1pbiI6dHJ1ZSwiaWF0IjoxNzYzMjc5NzMxLCJleHAiOjE3OTQ4MzczMzEsInN1YiI6IjMifQ.4ZkL0AUTMbkWNLQRBsphuPltw8lgnVoq48rD775ymjw',
  );
  if (userResult.ok) {
    userList.value = userResult.data;
  }

  console.log('User List:', userList.value);

  const feedbackResult = await api.feedback.all(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc19hZG1pbiI6dHJ1ZSwiaWF0IjoxNzYzMjc5NzMxLCJleHAiOjE3OTQ4MzczMzEsInN1YiI6IjMifQ.4ZkL0AUTMbkWNLQRBsphuPltw8lgnVoq48rD775ymjw',
  );
  if (feedbackResult.ok) {
    feedback.value = feedbackResult.data;
  }

  const bookingsResult = await api.bookings.all(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc19hZG1pbiI6dHJ1ZSwiaWF0IjoxNzYzMjc5NzMxLCJleHAiOjE3OTQ4MzczMzEsInN1YiI6IjMifQ.4ZkL0AUTMbkWNLQRBsphuPltw8lgnVoq48rD775ymjw',
  );
  if (bookingsResult.ok) {
    bookings.value = bookingsResult.data;
  }
});
/** 
function announcementUpdate(title:string,content:string){
  api.announcement.omit(title:string,content:string)
}
**/

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
            v-for="user in userList"
            :key="user.user_id"
            class="clickable card"
          >
            <strong>{{ user.given_names }}</strong> — {{ user.email }}
          </li>
        </ul>
      </div>
      <div v-else-if="page === 'booking'">
        <ul id="ItemsDisplayColumn">
          <li v-for="(b, i) in bookings" :key="i" class="clickable card">
            <strong>{{ b.user_id }}</strong> — {{ b.booking_datetime }}:
            {{ b.notes }}
          </li>
        </ul>
      </div>
      <div v-else-if="page === 'content'" id="ItemsDisplayColumn">
        <button @click="page = 'add_content'">Add Content</button>
        <article
          v-for="(item, i) in announcements"
          :key="i"
          class="clickable card"
        >
          <button>Delete</button>
          <h2>{{ item.config?.title }}</h2>
          <h3>{{ formatDate(item.config?.date) }}</h3>
          <p>{{ item.config?.content }}</p>
        </article>
      </div>
      <div v-else-if="page === 'service'" id="ItemsDisplayColumn">
        <button @click="page = 'add_service'">Add Services</button>
        <li v-for="(e, i) in services" :key="i" class="clickable card">
          <button>Delete</button>
          <strong>{{ e.config?.fees }}</strong> — {{ e.config?.name }}
        </li>
      </div>
      <div v-else-if="page === 'add_content'" id="ItemsDisplayColumn">
        <h1>Add Announcement</h1>
        <form class="form" action="" @submit.prevent="submit">
          <InputText v-model="fields.title" name="title" label="Title" />

          <InputTextarea
            v-model="fields.content"
            name="content"
            label="Content"
          />

          <div class="button-row">
            <button type="submit" class="button-filled">Submit</button>
          </div>
        </form>
      </div>
      <div v-else-if="page === 'add_service'" id="ItemsDisplayColumn">
        <h1>Add Service</h1>
        <form class="form" action="" @submit.prevent="submit">
          <InputText v-model="fields.name" name="name" label="Name" />

          <InputText v-model="fields.fees" name="fees" label="Fees" />

          <div class="button-row">
            <button type="submit" class="button-filled">Submit</button>
          </div>
        </form>
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
#MainContent {
  margin: auto;
  width: 50%;
  padding: 10px;
  display: flex;
  align-items: baseline;
  border: 1px;
  border-color: var(--border-color);
  border-style: double;
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

#ItemsDisplayColumn {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
