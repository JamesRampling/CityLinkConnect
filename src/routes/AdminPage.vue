<script setup lang="ts">
import api from '@/api';
import ApiErrorMessage from '@/components/ApiErrorMessage.vue';
import BookingCard from '@/components/BookingCard.vue';
import IconEdit from '@/components/icons/IconEdit.vue';
import LoadedData from '@/components/LoadedData.vue';
import { useUser } from '@/user';
import { formatDate } from '@/utils';
import { ref } from 'vue';

const { token } = useUser();

const page = ref('user');
</script>

<template>
  <div class="sidebar-container">
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
    <div id="MainContent" class="page-wrapper">
      <h1>Good morning Admin</h1>

      <div v-if="page === 'user'" class="item-list">
        <LoadedData :action="() => api.account.all(token)">
          <template #ok="{ data }">
            <div
              v-for="user in data"
              :key="user.user_id"
              class="clickable card"
            >
              <strong>{{ user.given_names }}</strong> — {{ user.email }}
            </div>
          </template>

          <template #error="{ error }">
            <ApiErrorMessage :error />
          </template>
        </LoadedData>
      </div>
      <div v-else-if="page === 'booking'" class="item-list">
        <LoadedData :action="() => api.bookings.allAdmin(token)">
          <template #ok="{ data: bookings }">
            <BookingCard
              v-for="b in bookings"
              :key="b.booking_id"
              :booking="b"
            />
          </template>

          <template #error="{ error }">
            <ApiErrorMessage :error />
          </template>
        </LoadedData>
      </div>
      <div v-else-if="page === 'content'" class="item-list">
        <LoadedData :action="() => api.announcements.all()">
          <template #ok="{ data: announcements }">
            <div class="button-row">
              <button class="button-filled" @click="page = 'add_content'">
                Add Content
              </button>
            </div>
            <article
              v-for="(item, i) in announcements"
              :key="i"
              class="clickable card"
            >
              <div class="button-row">
                <router-link
                  class="button-outlined"
                  :to="`/announcement/edit/${item.announcement_id}`"
                  ><IconEdit />Edit Announcement</router-link
                >
                <button
                  @click="api.announcements.delete(item.announcement_id, token)"
                  class="button-outlined"
                >
                  Delete
                </button>
              </div>
              <h2>{{ item.config?.title }}</h2>
              <h3>{{ formatDate(item.config?.date) }}</h3>
              <p>{{ item.config?.content }}</p>
            </article>
          </template>

          <template #error="{ error }">
            <ApiErrorMessage :error />
          </template>
        </LoadedData>
      </div>
      <div v-else-if="page === 'service'" class="item-list">
        <button class="button-filled" @click="page = 'add_service'">
          Add Services
        </button>
        <LoadedData :action="() => api.services.all()">
          <template #ok="{ data: services }">
            <li v-for="(e, i) in services" :key="i" class="clickable card">
              <button>Delete</button>
              <strong>{{ e.config?.fees }}</strong> — {{ e.config?.name }}
            </li>
          </template>
        </LoadedData>
      </div>
      <!--
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
      <div v-else-if="page === 'add_service'" class="item-list">
        <h1>Add Service</h1>
        <form class="form" action="" @submit.prevent="submit">
          <InputText v-model="fields.name" name="name" label="Name" />

          <InputText v-model="fields.fees" name="fees" label="Fees" />

          <div class="button-row">
            <button type="submit" class="button-filled">Submit</button>
          </div>
        </form>
      </div>
      -->
    </div>
  </div>
</template>

<style lang="css" scoped>
#SideBar {
  background-color: var(--bgcolor);
  display: flex;
  flex-direction: column;

  align-self: start;
  position: sticky;
  top: 3.5rem;
  overflow: auto;

  @media (width < 80ch) {
    flex-direction: row;
  }
}
.squareButton {
  padding: 2rem;

  text-align: center;
  font-size: medium;
  background: transparent;
  line-height: 50%;

  border: none;
  border-bottom: 1px solid var(--border-color);

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

.sidebar-container {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 3fr;

  @media (width < 80ch) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
}
#MainContent {
  display: block;
  width: 100%;
}

.item-list {
  display: grid;
  gap: 1rem;
}
</style>
