<script setup lang="ts">
import api from '@/api';
import LoadedData from '@/components/LoadedData.vue';
import { formatDate } from '@/utils';
</script>

<template>
  <!--
    Photo by Alex Reynolds on Unsplash
    https://unsplash.com/photos/aerial-view-of-suburban-buildings-and-distant-city-skyline-yt7Jc2S8y0I
  -->
  <img class="backdrop-image" src="/src/assets/hero-splash.jpg" alt="" />
  <div class="page-wrapper">
    <h1>CityLink Connect</h1>

    <LoadedData :action="() => api.announcements.all()">
      <template #loading> Loading... </template>

      <template #ok="{ data: announcements }">
        <div class="announcements-wrapper">
          <router-link
            v-for="{ announcement_id: index, config: content } in announcements"
            :key="content.title"
            class="card clickable"
            :to="`/announcement/${index}`"
            tabindex="0"
          >
            <hgroup>
              <h2 class="title">{{ content.title }}</h2>
              <p class="subtitle">
                <time :datetime="content.date">{{
                  formatDate(content.date)
                }}</time>
              </p>
            </hgroup>

            <p>{{ content.content }}</p>
          </router-link>
        </div>
      </template>

      <template #error="{ error }">
        <!-- TODO: Add better error messages -->
        An error occurred: {{ error }}
      </template>
    </LoadedData>
  </div>
</template>

<style scoped>
.backdrop-image {
  --overlap: 12rem;
  --gradient: 14rem;

  display: block;
  min-height: calc(4rem + var(--overlap));
  aspect-ratio: 4/1;
  width: 100%;
  object-fit: cover;
  mask-image: linear-gradient(to top, transparent, black var(--gradient));
  margin-bottom: calc(var(--overlap) * -1);
  z-index: -1;
}

.page-wrapper {
  position: relative;
}

h1 {
  text-shadow:
    0 0 2rem var(--bgcolor),
    0 0 1rem var(--bgcolor),
    0 0 0.5rem var(--bgcolor),
    0 0 0.25rem var(--bgcolor);
}

.announcements-wrapper {
  display: grid;
  gap: 1rem;
}
</style>
