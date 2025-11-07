<script setup lang="ts">
import { useExampleData } from '@/exampleData';
import { formatDate } from '@/utils';
import { computed } from 'vue';

const { announcements } = useExampleData();
const articles = computed(() => announcements.value);
</script>

<template>
  <!--
    Photo by Alex Reynolds on Unsplash
    https://unsplash.com/photos/aerial-view-of-suburban-buildings-and-distant-city-skyline-yt7Jc2S8y0I
  -->
  <img class="backdrop-image" src="/src/assets/hero-splash.jpg" />
  <div class="page-wrapper">
    <h1>CityLink Connect</h1>

    <div class="announcements-wrapper">
      <article
        v-for="[idx, item] in articles.entries()"
        :key="item.title"
        class="clickable-card card"
        @click="$router.push(`/announcement/${idx}`)"
      >
        <hgroup>
          <h2 class="title">{{ item.title }}</h2>
          <p class="subtitle">
            <time :datetime="item.date">{{ formatDate(item.date) }}</time>
          </p>
        </hgroup>

        <p>{{ item.content }}</p>
      </article>
    </div>
  </div>
</template>

<style scoped>
.backdrop-image {
  display: block;
  min-height: 8rem;
  aspect-ratio: 8/1;
  width: 100%;
  object-fit: cover;
}

.announcements-wrapper {
  display: grid;
  gap: 1rem;
}
</style>
