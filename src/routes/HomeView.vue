<script setup lang="ts">
import { useExampleData } from '@/exampleData';
import { formatDate } from '@/utils';
import { computed } from 'vue';

const { announcements } = useExampleData();
const articles = computed(() => announcements.value);
</script>

<template>
  <!--Photo by Alex Reynolds on Unsplash https://unsplash.com/photos/aerial-view-of-suburban-buildings-and-distant-city-skyline-yt7Jc2S8y0I -->
  <img src="/src/assets/hero-splash.jpg" />
  <div class="page-wrapper">
    <h1>CityLink Connect</h1>

    <article
      v-for="[idx, item] in articles.entries()"
      :key="item.title"
      class="clickable-card"
      @click="$router.push(`/announcement/${idx}`)"
    >
      <h2>{{ item.title }}</h2>
      <h3>{{ formatDate(item.date) }}</h3>
      <p>{{ item.content }}</p>
    </article>
  </div>
</template>

<style scoped>
img {
  max-width: 100%;
  min-height: 6rem;
  aspect-ratio: 10/1;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.page-wrapper {
  display: grid;
  gap: 1rem;
  padding-block-end: 2rem;

  h1 {
    margin-block: 0;
  }
}

article {
  h2 {
    margin: 0;
  }

  h3 {
    margin-block-start: 0.5rem;
    margin-block-end: 0;
  }

  p {
    margin-block-start: 0.5rem;
    margin-block-end: 0;
  }
}
</style>
